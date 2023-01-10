type DecryptedSuffix = '_Dec';

export type StringToType = {
  string: string;
  number: number;
  boolean: boolean;
};
export type Encryptable = StringToType[keyof StringToType];

type TypeToString<T extends Encryptable> = keyof {
  [K in keyof StringToType as T extends StringToType[K] ? K : never]: never;
};

// ---------- Encryption Types ---------------

export type ConvertToEncryptType<T> = T extends Record<string, unknown>[]
  ? ConvertToEncryptTypeSingle<T[0]>[]
  : T extends Record<string, unknown>
  ? ConvertToEncryptTypeSingle<T>
  : T;

export type ConvertToEncryptTypeSingle<T extends Record<string, unknown>> = {
  [Key in keyof T as HandleDecryptedSuffix<
    Key,
    T[Key]
  >]: Key extends `${string}${DecryptedSuffix}` ? string : T[Key];
};

// If T has been Decrypted, append the type at the end e.g. name_string
type HandleDecryptedSuffix<Key, Value> =
  Key extends `${infer Prop}${DecryptedSuffix}${string}`
    ? Value extends Encryptable
      ? `${Prop}_${string & TypeToString<Value>}`
      : Key
    : Key;

// ---------- End Encryption Types ---------------

// ---------- Decryption Types ---------------

export type ConvertToDecryptType<T> = T extends Record<string, unknown>[]
  ? ConvertToDecryptTypeSingle<T[0]>[]
  : T extends Record<string, unknown>
  ? ConvertToDecryptTypeSingle<T>
  : T;

export type ConvertToDecryptTypeSingle<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T as AddDec<K>]: K extends `${string}_${infer Type extends keyof StringToType}`
        ? null extends T[K]
          ? StringToType[Type] | null
          : StringToType[Type]
        : T[K];
    }
  : T;

type AddDec<Key> = Key extends `${infer KeyName}_${keyof StringToType}`
  ? `${KeyName}${DecryptedSuffix}`
  : Key;

// ---------- End Decryption Types ---------------
