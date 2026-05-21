export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_allowlist: {
        Row: { created_at: string; email: string };
        Insert: { created_at?: string; email: string };
        Update: { created_at?: string; email?: string };
        Relationships: [];
      };
      businesses: {
        Row: {
          created_at: string;
          google_place_id: string | null;
          id: string;
          location: string | null;
          name: string;
          review_source: Database["public"]["Enums"]["review_source"];
          slug: string;
          tags: string[];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          google_place_id?: string | null;
          id?: string;
          location?: string | null;
          name: string;
          review_source?: Database["public"]["Enums"]["review_source"];
          slug: string;
          tags?: string[];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          google_place_id?: string | null;
          id?: string;
          location?: string | null;
          name?: string;
          review_source?: Database["public"]["Enums"]["review_source"];
          slug?: string;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      voc_reports: {
        Row: {
          business_id: string;
          created_at: string;
          error_message: string | null;
          generated_at: string | null;
          id: string;
          period: string;
          public_slug: string;
          report_data: Json | null;
          review_count: number;
          scraped_reviews: Json | null;
          status: Database["public"]["Enums"]["report_status"];
          updated_at: string;
        };
        Insert: {
          business_id: string;
          created_at?: string;
          error_message?: string | null;
          generated_at?: string | null;
          id?: string;
          period: string;
          public_slug: string;
          report_data?: Json | null;
          review_count?: number;
          scraped_reviews?: Json | null;
          status?: Database["public"]["Enums"]["report_status"];
          updated_at?: string;
        };
        Update: {
          business_id?: string;
          created_at?: string;
          error_message?: string | null;
          generated_at?: string | null;
          id?: string;
          period?: string;
          public_slug?: string;
          report_data?: Json | null;
          review_count?: number;
          scraped_reviews?: Json | null;
          status?: Database["public"]["Enums"]["report_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "voc_reports_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      slugify: { Args: { input: string }; Returns: string };
    };
    Enums: {
      report_status: "pending" | "scraping" | "analyzing" | "ready" | "failed";
      review_source: "google" | "tripadvisor" | "trustpilot";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
