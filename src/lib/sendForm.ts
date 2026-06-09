export async function sendForm(
  name: string,
  phone: string
) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("phone", phone);

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