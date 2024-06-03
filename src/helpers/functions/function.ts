function getEnumByValue(Enum: any, value: string): string | undefined {
  return Object.keys(Enum)[Object.values(Enum).indexOf(value)];
}
