// Jenis laporan
export const TypeReport = (status: string) => {
  const map: Record<string, string> = {
    FK: "Fasilitas Kamar",
    FU: "Fasilitas Umum",
    K: "Komplain",
  };

  return map[status] || status; // fallback: tampilkan kode asli
};

// Jenis kerusakan
export const TypeBroken = (status: string) => {
  const map: Record<string, string> = {
    R: "Ringan",
    S: "Sedang",
    B: "Berat",
  };

  return map[status] || status;
};
