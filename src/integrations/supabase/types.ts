export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          attachment_file_path: string | null
          attachment_type: string | null
          attachment_url: string | null
          course_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_required: boolean | null
          lesson_id: string | null
          points: number | null
          position: number | null
          title: string
          updated_at: string
        }
        Insert: {
          attachment_file_path?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          points?: number | null
          position?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          attachment_file_path?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          points?: number | null
          position?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_percentage: number
          id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_percentage: number
          id?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_percentage?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          about_course: string | null
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          features: string[] | null
          id: string
          instructor: string | null
          instructor_bio: string | null
          instructor_company: string | null
          instructor_experience: string | null
          instructor_title: string | null
          is_free: boolean | null
          level: string | null
          original_price: number | null
          price: number | null
          rating: number | null
          review_count: number | null
          slug: string
          student_count: number | null
          tags: string[] | null
          title: string
          total_lessons: number | null
          updated_at: string
        }
        Insert: {
          about_course?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          features?: string[] | null
          id?: string
          instructor?: string | null
          instructor_bio?: string | null
          instructor_company?: string | null
          instructor_experience?: string | null
          instructor_title?: string | null
          is_free?: boolean | null
          level?: string | null
          original_price?: number | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          slug: string
          student_count?: number | null
          tags?: string[] | null
          title: string
          total_lessons?: number | null
          updated_at?: string
        }
        Update: {
          about_course?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          features?: string[] | null
          id?: string
          instructor?: string | null
          instructor_bio?: string | null
          instructor_company?: string | null
          instructor_experience?: string | null
          instructor_title?: string | null
          is_free?: boolean | null
          level?: string | null
          original_price?: number | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          slug?: string
          student_count?: number | null
          tags?: string[] | null
          title?: string
          total_lessons?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          download_type: string | null
          download_url: string | null
          file_path: string | null
          id: string
          pages: number | null
          preview_url: string | null
          price: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_type?: string | null
          download_url?: string | null
          file_path?: string | null
          id?: string
          pages?: number | null
          preview_url?: string | null
          price?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_type?: string | null
          download_url?: string | null
          file_path?: string | null
          id?: string
          pages?: number | null
          preview_url?: string | null
          price?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string
          enrolled_at: string
          id: string
          item_id: string
          item_type: string
          price_paid: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          enrolled_at?: string
          id?: string
          item_id: string
          item_type: string
          price_paid?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          enrolled_at?: string
          id?: string
          item_id?: string
          item_type?: string
          price_paid?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          chapter_id: number | null
          chapter_title: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          duration_text: string | null
          id: string
          lesson_order: number | null
          slug: string
          title: string
          updated_at: string
          video_id: string | null
          youtube_url: string | null
        }
        Insert: {
          chapter_id?: number | null
          chapter_title?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          duration_text?: string | null
          id?: string
          lesson_order?: number | null
          slug: string
          title: string
          updated_at?: string
          video_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          chapter_id?: number | null
          chapter_title?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          duration_text?: string | null
          id?: string
          lesson_order?: number | null
          slug?: string
          title?: string
          updated_at?: string
          video_id?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          order_id: string
          price?: number
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method_id: string | null
          payment_proof_url: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method_id?: string | null
          payment_proof_url?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method_id?: string | null
          payment_proof_url?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          method_type: string
          qr_code_file_path: string | null
          qr_code_url: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          method_type: string
          qr_code_file_path?: string | null
          qr_code_url?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          method_type?: string
          qr_code_file_path?: string | null
          qr_code_url?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_answer_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean | null
          option_text: string
          order_number: number
          question_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_text: string
          order_number: number
          question_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean | null
          option_text?: string
          order_number?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          order_number: number
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_number: number
          points?: number | null
          question_text: string
          question_type: string
          quiz_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_number?: number
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_required: boolean | null
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number | null
          position: number | null
          show_correct_answers: boolean | null
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          position?: number | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          position?: number | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assignments: {
        Row: {
          assignment_id: string
          created_at: string
          feedback: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number | null
          submission_file_path: string | null
          submission_text: string | null
          submission_type: string | null
          submission_url: string | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          submission_file_path?: string | null
          submission_text?: string | null
          submission_type?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          feedback?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          submission_file_path?: string | null
          submission_text?: string | null
          submission_type?: string | null
          submission_url?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_assignments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      student_quiz_attempts: {
        Row: {
          answers: Json | null
          attempt_number: number
          completed_at: string | null
          created_at: string
          id: string
          passed: boolean | null
          quiz_id: string
          score: number
          started_at: string | null
          time_taken_seconds: number | null
          total_points: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempt_number: number
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean | null
          quiz_id: string
          score: number
          started_at?: string | null
          time_taken_seconds?: number | null
          total_points: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          passed?: boolean | null
          quiz_id?: string
          score?: number
          started_at?: string | null
          time_taken_seconds?: number | null
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          company: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          rating: number
          role: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          company: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          rating?: number
          role: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          company?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          rating?: number
          role?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string | null
          content_type: string | null
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          download_type: string | null
          download_url: string | null
          file_path: string | null
          gallery_images: string[] | null
          id: string
          note: string | null
          price: number | null
          prompt: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_type?: string | null
          download_url?: string | null
          file_path?: string | null
          gallery_images?: string[] | null
          id?: string
          note?: string | null
          price?: number | null
          prompt?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content_type?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_type?: string | null
          download_url?: string | null
          file_path?: string | null
          gallery_images?: string[] | null
          id?: string
          note?: string | null
          price?: number | null
          prompt?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          certificates_earned: number | null
          completed_courses: number | null
          created_at: string
          current_streak: number | null
          id: string
          total_courses: number | null
          total_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificates_earned?: number | null
          completed_courses?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          total_courses?: number | null
          total_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificates_earned?: number | null
          completed_courses?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          total_courses?: number | null
          total_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          last_watched_at: string | null
          updated_at: string
          user_id: string
          video_id: string
          watched_duration: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          updated_at?: string
          user_id: string
          video_id: string
          watched_duration?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_watched_at?: string | null
          updated_at?: string
          user_id?: string
          video_id?: string
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          course_id: string | null
          created_at: string
          description: string | null
          duration: number | null
          file_path: string
          id: string
          lesson_id: string | null
          thumbnail_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path: string
          id?: string
          lesson_id?: string | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path?: string
          id?: string
          lesson_id?: string | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_cart_items: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "USER" | "ADMIN"
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
      user_role: ["USER", "ADMIN"],
    },
  },
} as const
