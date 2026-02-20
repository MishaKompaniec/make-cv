import type { DocumentProps } from "@react-pdf/renderer";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import path from "path";
import React from "react";

import { getServerAuthSession } from "@/auth";
import {
  TEMPLATE_1_COLORS,
  TEMPLATE_1_ID,
  TemplatePdf1,
} from "@/components/pdf/templates/template-1/template-pdf";
import {
  TEMPLATE_2_ID,
  TemplatePdf2,
} from "@/components/pdf/templates/template-2/template-pdf";
import { getArray, getSelectedSections } from "@/lib/cv-data";
import type {
  CustomSectionPreviewItem,
  EducationPreviewItem,
  InterestPreviewItem,
  LanguagePreviewItem,
  SkillPreviewItem,
  WorkExperiencePreviewItem,
} from "@/lib/preview-items";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserAccess = {
  exportAccessUntil: Date | null;
  hasLifetimeAccess: boolean;
};

function hasPaidExportAccess(user: UserAccess): boolean {
  if (user.hasLifetimeAccess) return true;

  if (user.exportAccessUntil && user.exportAccessUntil.getTime() > Date.now()) {
    return true;
  }

  return false;
}

function sanitizeFileNameBase(value: string) {
  const normalized = (value || "").normalize("NFKC");
  const withoutControlChars = normalized.replaceAll(
    /[^\S\r\n\t\p{L}\p{N}._ -]/gu,
    "",
  );
  const withoutForbiddenWindowsChars = withoutControlChars.replaceAll(
    /[\\/:*?\"<>|]/g,
    "",
  );
  const collapsedWhitespace = withoutForbiddenWindowsChars
    .replaceAll(/\s+/g, " ")
    .trim();
  const withoutTrailingDotOrSpace = collapsedWhitespace.replaceAll(
    /[\s.]+$/g,
    "",
  );
  const base = withoutTrailingDotOrSpace
    .replaceAll(/[^\u007f\p{L}\p{N} _.-]/gu, "")
    .replaceAll(/\s+/g, "_")
    .replaceAll(/_+/g, "_")
    .replaceAll(/^_+|_+$/g, "");
  const limited = [...base].slice(0, 80).join("");
  return limited || "CV";
}

function registerInterFontsOnce() {
  const g = globalThis as unknown as {
    __cv_builder_inter_registered?: boolean;
  };
  if (g.__cv_builder_inter_registered) return;

  const base = path.join(process.cwd(), "src", "assets", "fonts");

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: path.join(base, "Inter-Regular.ttf"),
        fontWeight: 400,
      },
      {
        src: path.join(base, "Inter-Medium.ttf"),
        fontWeight: 500,
      },
      {
        src: path.join(base, "Inter-SemiBold.ttf"),
        fontWeight: 600,
      },
      {
        src: path.join(base, "Inter-Bold.ttf"),
        fontWeight: 700,
      },
    ],
  });

  g.__cv_builder_inter_registered = true;
}

function buildContentDisposition(fileName: string) {
  const asciiFallback = "cv.pdf";
  const safeAscii = sanitizeFileNameBase(fileName)
    .replaceAll(/[\u0080-\uFFFF]/g, "")
    .trim();
  const fallback = safeAscii ? `${safeAscii}.pdf` : asciiFallback;

  const encoded = encodeURIComponent(fileName);
  return `attachment; filename=\"${fallback}\"; filename*=UTF-8''${encoded}`;
}

export async function GET(request: Request) {
  try {
    registerInterFontsOnce();

    const url = new URL(request.url);
    const cvId = url.searchParams.get("cvId")?.trim();

    if (!cvId) {
      return NextResponse.json({ error: "cvId is required" }, { status: 400 });
    }

    const session = await getServerAuthSession();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        exportAccessUntil: true,
        hasLifetimeAccess: true,
        freePdfDownloadUsed: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAllowedPaid = hasPaidExportAccess(user);
    const isAllowedFree = !user.freePdfDownloadUsed;

    if (!isAllowedPaid && !isAllowedFree) {
      return NextResponse.json(
        { allowed: false, reason: "paywall" },
        { status: 402 },
      );
    }

    if (!isAllowedPaid && isAllowedFree) {
      await prisma.user.update({
        where: { id: user.id },
        data: { freePdfDownloadUsed: true },
      });
    }

    const cv = await prisma.cv.findFirst({
      where: { id: cvId, userId: user.id },
      select: {
        id: true,
        title: true,
        templateId: true,
        templateColors: true,
        data: true,
      },
    });

    if (!cv) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const templateId = cv.templateId ?? TEMPLATE_1_ID;
    const templateColors =
      (cv.templateColors as Record<string, string> | null) ?? {};

    const data = (cv.data ?? {}) as Record<string, unknown>;

    const previewData = {
      contactDetails:
        (data["contactDetails"] as Record<string, unknown> | undefined) ?? {},
      summary: (data["summary"] as string | undefined) ?? "",
      workExperience: getArray<WorkExperiencePreviewItem>(
        data,
        "workExperience",
      ),
      education: getArray<EducationPreviewItem>(data, "education"),
      skills: getArray<SkillPreviewItem>(data, "skills"),
      languages: getArray<LanguagePreviewItem>(data, "languages"),
      interests: getArray<InterestPreviewItem>(data, "interests"),
      customSections: getArray<CustomSectionPreviewItem>(
        data,
        "customSections",
      ),
      selectedSections: getSelectedSections(data),
    };

    const selectedColor =
      templateColors?.[templateId] ?? TEMPLATE_1_COLORS[0].value;

    const PdfDocument =
      templateId === TEMPLATE_2_ID ? TemplatePdf2 : TemplatePdf1;

    const pdfReactDocument = React.createElement(PdfDocument, {
      sidebarColor: selectedColor,
      contactDetails: previewData.contactDetails as Record<string, unknown>,
      workExperience: previewData.workExperience,
      education: previewData.education,
      skills: previewData.skills,
      languages: previewData.languages,
      interests: previewData.interests,
      customSections: previewData.customSections,
      selectedSections: previewData.selectedSections,
      summary: previewData.summary,
    }) as unknown as React.ReactElement<DocumentProps>;

    const pdfBuffer = await renderToBuffer(pdfReactDocument);

    const contactFullName = (
      previewData.contactDetails as Record<string, unknown>
    )?.fullName;
    const displayName =
      (typeof contactFullName === "string" && contactFullName.trim()) ||
      cv.title ||
      "CV";

    const fileNameBase = sanitizeFileNameBase(displayName);
    const fileName = `${fileNameBase}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": buildContentDisposition(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("/api/export/pdf failed", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
