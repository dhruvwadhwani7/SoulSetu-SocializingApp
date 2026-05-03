export type RawOption = {
  id: number;

  name: string;

  plural_name?: string | null;
};

/*
 converts null -> undefined
 so Option type compatibility is preserved
*/

export const normalizeOptions = <T extends RawOption>(options: T[] = []) => {
  return options.map((o) => ({
    id: o.id,

    name: o.name,

    plural_name: o.plural_name ?? undefined,
  }));
};
