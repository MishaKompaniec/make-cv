"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/layout/builder-header/builder-header";
import { NavigationFooter } from "@/components/layout/navigation-footer/navigation-footer";
import { Input } from "@/components/ui/input/input";
import { BaseModal } from "@/components/ui/modal/base-modal";
import { useKeyedDebouncedCallback } from "@/hooks/useKeyedDebouncedCallback";
import {
  type ContactDetailsFormData,
  contactDetailsSchema,
} from "@/lib/validations/cv-schema";

import { useCv } from "../provider";
import styles from "./page.module.scss";

const stepTitle = "Contact details";

const AVATAR_MAX_BYTES = 1 * 1024 * 1024;
const AVATAR_ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;

const AVATAR_OUTPUT_SIZE = 512;

const defaultContactDetails: ContactDetailsFormData = {
  fullName: "",
  jobTitle: "",
  city: "",
  phone: "",
  email: "",
  avatar: "",
  birthdate: "",
  postalCode: "",
  linkedIn: "",
  git: "",
  linkedInTitle: "",
  linkedInUrl: "",
  gitTitle: "",
  gitUrl: "",
  nationality: "",
  workPermit: "",
};

export default function ContactDetailsPage() {
  const router = useRouter();
  const { cvId, cv, isLoading: isCvLoading, patchCv } = useCv();

  const [avatarError, setAvatarError] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);

  const [cropSrc, setCropSrc] = useState<string>("");
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const didInitRef = useRef(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
    mode: "onChange",
    defaultValues: defaultContactDetails,
  });

  useEffect(() => {
    if (!cv) return;
    if (didInitRef.current) return;

    const data = (cv.data ?? {}) as Record<string, unknown>;
    const contactDetailsFromApi = data["contactDetails"] as
      | Partial<ContactDetailsFormData>
      | undefined;

    reset({
      ...defaultContactDetails,
      ...(contactDetailsFromApi ?? {}),
    });
    didInitRef.current = true;
  }, [cv, reset]);

  const patcher = useKeyedDebouncedCallback<
    keyof ContactDetailsFormData,
    unknown
  >(async (name, value) => {
    if (!cvId) return;
    await patchCv({
      data: {
        contactDetails: {
          [name]: value,
        },
      },
    });
  });

  const isSaving = patcher.getIsInFlight();

  const schedulePatch = useCallback(
    (name: keyof ContactDetailsFormData, value: unknown) => {
      if (!didInitRef.current) return;
      if (!cvId) return;
      patcher.schedule(name, value);
    },
    [cvId, patcher],
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const registerWithFlush = (name: keyof ContactDetailsFormData) => {
    const field = register(name);
    return {
      ...field,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        field.onChange(e);
        schedulePatch(name, e.target.value);
      },
      onBlur: (e: FocusEvent<HTMLInputElement>) => {
        field.onBlur(e);
      },
    };
  };

  const handleNextClick = handleSubmit(async () => {
    if (!cvId) return;
    try {
      await patcher.flush();
      router.push(`/cv-builder/${cvId}/summary`);
    } finally {
      // patcher manages isSaving via in-flight tracking
    }
  });

  const handleAvatarFile = (file: File | null) => {
    setAvatarError("");

    if (!file) return;

    if (
      !AVATAR_ALLOWED_MIME.includes(
        file.type as "image/jpeg" | "image/png" | "image/webp",
      )
    ) {
      setAvatarError("Unsupported file type. Please upload PNG, JPG or WEBP.");
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError("File is too large. Max size is 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setAvatarError("Failed to read the file.");
    };
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string" || !result.startsWith("data:image/")) {
        setAvatarError("Invalid image file.");
        return;
      }

      setCropSrc(result);
      setIsCropOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setAvatarError("");
    setValue("avatar", "", { shouldDirty: true, shouldValidate: true });
    schedulePatch("avatar", "");
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const closeCrop = () => {
    setIsCropOpen(false);
    setCropSrc("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });
  };

  const canvasToDataUrlWithLimit = (canvas: HTMLCanvasElement) => {
    const maxChars = AVATAR_MAX_BYTES * 1.37;
    let quality = 0.92;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    while (dataUrl.length > maxChars && quality > 0.6) {
      quality -= 0.05;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    return dataUrl.length <= maxChars ? dataUrl : "";
  };

  const getCroppedAvatarDataUrl = async () => {
    if (!cropSrc || !croppedAreaPixels) return "";
    const img = await loadImage(cropSrc);

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const { x, y, width, height } = croppedAreaPixels;
    ctx.drawImage(
      img,
      x,
      y,
      width,
      height,
      0,
      0,
      AVATAR_OUTPUT_SIZE,
      AVATAR_OUTPUT_SIZE,
    );

    let dataUrl = canvasToDataUrlWithLimit(canvas);
    if (dataUrl) return dataUrl;

    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 384;
    smallCanvas.height = 384;
    const sctx = smallCanvas.getContext("2d");
    if (!sctx) return "";
    sctx.drawImage(canvas, 0, 0, 384, 384);
    dataUrl = canvasToDataUrlWithLimit(smallCanvas);
    return dataUrl;
  };

  const saveCroppedAvatar = async () => {
    setAvatarError("");
    try {
      const dataUrl = await getCroppedAvatarDataUrl();
      if (!dataUrl) {
        setAvatarError("Failed to crop image. Try adjusting zoom.");
        return;
      }
      setValue("avatar", dataUrl, { shouldDirty: true, shouldValidate: true });
      schedulePatch("avatar", dataUrl);
      closeCrop();
    } catch {
      setAvatarError("Failed to crop image.");
    }
  };

  const onCropComplete = (_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        stepNumber="Step 2"
        title={stepTitle}
        description="Enter your personal and professional information to display your contact details clearly and consistently on your CV, making it easy for recruiters to reach you and view your online profiles."
      />

      <section className={styles.wrapper}>
        <div className={styles.content}>
          <form className={styles.form} autoComplete="on">
            <div className={styles.fieldGroup}>
              <Input
                label="Full name"
                placeholder="Jane Doe"
                fullWidth
                required
                autoComplete="name"
                {...registerWithFlush("fullName")}
                error={errors.fullName?.message}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Job title"
                  placeholder="Product Designer"
                  fullWidth
                  required
                  autoComplete="organization-title"
                  {...registerWithFlush("jobTitle")}
                  error={errors.jobTitle?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="City"
                  placeholder="Copenhagen, Denmark"
                  fullWidth
                  required
                  autoComplete="address-level2"
                  {...registerWithFlush("city")}
                  error={errors.city?.message}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="(+45) 1234 5678"
                  fullWidth
                  required
                  autoComplete="tel"
                  {...registerWithFlush("phone")}
                  error={errors.phone?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="jane@email.com"
                  fullWidth
                  required
                  autoComplete="email"
                  {...registerWithFlush("email")}
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.avatarSection}>
              <div className={styles.avatarRow}>
                <div className={styles.avatarPreview}>
                  {isHydrated && watch("avatar") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={styles.avatarImage}
                      src={watch("avatar")}
                      alt="Avatar"
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>

                <div className={styles.avatarActions}>
                  <label className={styles.avatarUploadButton}>
                    Upload photo
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className={styles.avatarFileInput}
                      onChange={(e) =>
                        handleAvatarFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.avatarRemoveButton}
                    onClick={clearAvatar}
                    disabled={!isHydrated || !watch("avatar")}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {avatarError ? (
                <div className={styles.avatarError}>{avatarError}</div>
              ) : null}
              <div className={styles.avatarHint}>
                PNG, JPG or WEBP. Max 1 MB.
              </div>
            </div>

            {isCropOpen && (
              <BaseModal
                isOpen={isCropOpen}
                onClose={closeCrop}
                title="Crop your photo"
                descriptionId="crop-photo-modal-description"
                showCloseButton
              >
                <div className={styles.cropModal}>
                  <div className={styles.cropHeader}>
                    <div className={styles.cropTitle}>Crop your photo</div>
                  </div>

                  <div className={styles.cropContainer}>
                    <Cropper
                      image={cropSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      objectFit="contain"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className={styles.cropControls}>
                    <label className={styles.cropZoomLabel}>
                      Zoom
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) =>
                          setZoom(Math.max(1, Number(e.target.value) || 1))
                        }
                      />
                    </label>
                  </div>

                  <div className={styles.cropButtons}>
                    <button
                      type="button"
                      className={styles.cropCancel}
                      onClick={closeCrop}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.cropSave}
                      onClick={saveCroppedAvatar}
                      disabled={!croppedAreaPixels}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </BaseModal>
            )}

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Birthdate"
                  placeholder="DD/MM/YYYY"
                  fullWidth
                  autoComplete="bday"
                  {...registerWithFlush("birthdate")}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Postal code"
                  placeholder="1234"
                  fullWidth
                  autoComplete="postal-code"
                  {...registerWithFlush("postalCode")}
                  error={errors.postalCode?.message}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Nationality"
                  placeholder="Danish"
                  fullWidth
                  {...registerWithFlush("nationality")}
                  error={errors.nationality?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Work permit"
                  placeholder="EU Citizen"
                  fullWidth
                  {...registerWithFlush("workPermit")}
                />
              </div>
            </div>

            <div className={styles.divider}></div>

            <p className={styles.hint}>
              In the PDF, the title is shown as clickable text, and it will open
              the URL you provide.
            </p>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="LinkedIn title"
                  placeholder="LinkedIn"
                  fullWidth
                  {...registerWithFlush("linkedInTitle")}
                  error={errors.linkedInTitle?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/janedoe"
                  fullWidth
                  {...registerWithFlush("linkedInUrl")}
                  error={errors.linkedInUrl?.message}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <Input
                  label="Git title"
                  placeholder="GitHub"
                  fullWidth
                  {...registerWithFlush("gitTitle")}
                  error={errors.gitTitle?.message}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Input
                  label="Git URL"
                  placeholder="https://github.com/janedoe"
                  fullWidth
                  {...registerWithFlush("gitUrl")}
                  error={errors.gitUrl?.message}
                />
              </div>
            </div>
          </form>
        </div>
      </section>

      <NavigationFooter
        backHref={`/cv-builder/${cvId}`}
        nextHref={`/cv-builder/${cvId}/summary`}
        nextLabel="Next Step"
        nextDisabled={isCvLoading || !didInitRef.current || isSaving}
        nextLoading={isSaving}
        onNextClick={handleNextClick}
      />
    </div>
  );
}
