export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cheat_sheets: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          topic: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      coding_problems: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          problem_url: string
          tags: string[] | null
          title: string
          topic: Database["public"]["Enums"]["topic_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          problem_url: string
          tags?: string[] | null
          title: string
          topic: Database["public"]["Enums"]["topic_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          problem_url?: string
          tags?: string[] | null
          title?: string
          topic?: Database["public"]["Enums"]["topic_type"]
        }
        Relationships: []
      }
      mcqs: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          topic: Database["public"]["Enums"]["topic_type"]
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          topic: Database["public"]["Enums"]["topic_type"]
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          topic?: Database["public"]["Enums"]["topic_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          score: number | null
          started_at: string | null
          time_limit_minutes: number | null
          topic: Database["public"]["Enums"]["topic_type"]
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          topic: Database["public"]["Enums"]["topic_type"]
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          score?: number | null
          started_at?: string | null
          time_limit_minutes?: number | null
          topic?: Database["public"]["Enums"]["topic_type"]
          total_questions?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_coding_progress: {
        Row: {
          attempted: boolean | null
          attempted_at: string | null
          id: string
          problem_id: string | null
          solved: boolean | null
          solved_at: string | null
          user_id: string | null
        }
        Insert: {
          attempted?: boolean | null
          attempted_at?: string | null
          id?: string
          problem_id?: string | null
          solved?: boolean | null
          solved_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempted?: boolean | null
          attempted_at?: string | null
          id?: string
          problem_id?: string | null
          solved?: boolean | null
          solved_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_coding_progress_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "coding_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mcq_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          is_correct: boolean
          mcq_id: string | null
          selected_answer: string
          user_id: string | null
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          is_correct: boolean
          mcq_id?: string | null
          selected_answer: string
          user_id?: string | null
        }
        Update: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean
          mcq_id?: string | null
          selected_answer?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mcq_attempts_mcq_id_fkey"
            columns: ["mcq_id"]
            isOneToOne: false
            referencedRelation: "mcqs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_video_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video_tutorials"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tutorials: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes: number | null
          id: string
          platform: string
          title: string
          topic: Database["public"]["Enums"]["topic_type"]
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes?: number | null
          id?: string
          platform: string
          title: string
          topic: Database["public"]["Enums"]["topic_type"]
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration_minutes?: number | null
          id?: string
          platform?: string
          title?: string
          topic?: Database["public"]["Enums"]["topic_type"]
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "medium" | "high"
      platform_type:
        | "leetcode"
        | "hackerrank"
        | "codeforces"
        | "codechef"
        | "geeksforgeeks"
      topic_type:
        | "strings"
        | "basics"
        | "bit_manipulation"
        | "sorting"
        | "searching"
        | "hashmaps"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["beginner", "medium", "high"],
      platform_type: [
        "leetcode",
        "hackerrank",
        "codeforces",
        "codechef",
        "geeksforgeeks",
      ],
      topic_type: [
        "strings",
        "basics",
        "bit_manipulation",
        "sorting",
        "searching",
        "hashmaps",
      ],
    },
  },
} as const
