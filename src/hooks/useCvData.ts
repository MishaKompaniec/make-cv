import { useLocalStorage } from "./useLocalStorage";
import {
  type ContactDetailsFormData,
  type CvFormData,
} from "@/lib/validations/cv-schema";

const defaultContactDetails: ContactDetailsFormData = {
  fullName: "",
  jobTitle: "",
  city: "",
  phone: "",
  email: "",
  birthdate: "",
  postalCode: "",
  linkedIn: "",
  git: "",
  nationality: "",
  workPermit: "",
};

export function useCvData() {
  const [contactDetails, setContactDetails] =
    useLocalStorage<ContactDetailsFormData>(
      "cv-contact-details",
      defaultContactDetails,
    );

  const clearAllData = () => {
    setContactDetails(defaultContactDetails);
    // Здесь будем добавлять очистку других шагов
  };

  const exportData = () => {
    const data = {
      contactDetails,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.contactDetails) {
        setContactDetails({
          ...defaultContactDetails,
          ...data.contactDetails,
        });
      }
      return true;
    } catch (error) {
      console.error("Error importing CV data:", error);
      return false;
    }
  };

  return {
    contactDetails,
    setContactDetails,
    clearAllData,
    exportData,
    importData,
  };
}
