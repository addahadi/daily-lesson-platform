async function uploadImageToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "courses"); // your upload preset name

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/duw0bz1md/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Upload failed:", errorData);
    return null;
  }

  const data = await res.json();
  return data.secure_url; // ✅ This is the image URL to save in DB
}

export default uploadImageToCloudinary