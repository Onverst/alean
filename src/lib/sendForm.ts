const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const UTM_STORAGE_KEY = "alean_utm_params";

function getUtmParams() {
  const utmParams: Record<(typeof UTM_KEYS)[number], string> = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  };

  if (typeof window === "undefined") {
    return utmParams;
  }

  try {
    const storedParams = JSON.parse(
      window.sessionStorage.getItem(UTM_STORAGE_KEY) ?? "{}"
    ) as Partial<typeof utmParams>;
    const searchParams = new URLSearchParams(window.location.search);

    UTM_KEYS.forEach((key) => {
      utmParams[key] = searchParams.get(key) ?? storedParams[key] ?? "";
    });

    window.sessionStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify(utmParams)
    );
  } catch {
    const searchParams = new URLSearchParams(window.location.search);

    UTM_KEYS.forEach((key) => {
      utmParams[key] = searchParams.get(key) ?? "";
    });
  }

  return utmParams;
}

function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

export async function sendForm(
  name: string,
  phone: string
) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("phone", phone);

  const utmParams = getUtmParams();

  UTM_KEYS.forEach((key) => {
    formData.append(key, utmParams[key]);
  });

  formData.append("roistat_visit", getCookie("roistat_visit") ?? "nocookie");

  const url = process.env.NEXT_PUBLIC_WORDPRESS_FORM_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_WORDPRESS_FORM_URL not found");
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Form send error");
  }

  return response.text();
}
