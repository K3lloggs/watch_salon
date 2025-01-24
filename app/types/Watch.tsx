// app/types/Watch.ts

export interface Watch {
    id: string;
    brand: string;
    model: string;
    price: number;
    year?: string;
    image: string[];  // Array of image URLs
    caseMaterial?: string;
    caseDiameter?: string;
    box?: boolean;
    papers?: boolean;
    newArrival?: boolean;  // If you use this field
    // Optionally allow unknown additional properties:
    // [key: string]: string | number | string[] | boolean | undefined;
  }
  