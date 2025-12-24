export interface SpecificationInput {
  name: string;
  description?: string;
  properties?: Record<string, unknown>;
}

export interface SpecificationOutput {
  name: string;
  description?: string;
  properties?: Record<string, unknown>;
}

export interface Specification {
  name: string;
  version: string;
  inputs?: SpecificationInput[];
  outputs?: SpecificationOutput[];
  description?: string;
}
