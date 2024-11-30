export interface Template {
  title: string;
  category: string;
  format: string;
  adType: string;
  image: string;
  canvaUrl: string;
  figmaUrl: string;
  isFree?: boolean;
}

export interface FormData {
  brandName: string;
  websiteUrl: string;
  industry: string;
  brandTone: string;
  mainArgument: string;
  targetCustomer: string;
  productName: string;
  productFeatures: string;
  productUrl: string;
  keywords: string;
  testimonials: string;
  timestamp?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface AnalysisResult {
  products: Product[];
  categories: string[];
  mainKeywords: string[];
  brandName: string;
  websiteUrl: string;
}