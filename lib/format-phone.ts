export const formatPhone = (value: string): string => {
  if (!value) {
    return "";
  }
  value = value.replace(/\D/g, "");

  if (value.length > 10) {
    return value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else {
    return value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  }
};
