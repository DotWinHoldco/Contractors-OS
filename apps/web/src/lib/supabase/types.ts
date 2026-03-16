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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: Database["public"]["Enums"]["activity_action"]
          changes: Json | null
          created_at: string | null
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["activity_entity_type"]
          id: string
          ip_address: unknown
          metadata: Json | null
          tenant_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["activity_action"]
          changes?: Json | null
          created_at?: string | null
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["activity_entity_type"]
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["activity_action"]
          changes?: Json | null
          created_at?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["activity_entity_type"]
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "activity_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_ab_test_results: {
        Row: {
          ab_test_id: string
          ai_generation_id: string | null
          created_at: string | null
          error_message: string | null
          estimated_cost: number | null
          feedback: Database["public"]["Enums"]["ai_feedback"] | null
          had_error: boolean | null
          id: string
          input_tokens: number | null
          latency_ms: number | null
          metadata: Json | null
          model_id: string
          module: Database["public"]["Enums"]["ai_module"] | null
          output_tokens: number | null
          quality_score: number | null
          tenant_id: string
          total_tokens: number | null
          user_id: string | null
          variant: string
        }
        Insert: {
          ab_test_id: string
          ai_generation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          estimated_cost?: number | null
          feedback?: Database["public"]["Enums"]["ai_feedback"] | null
          had_error?: boolean | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          model_id: string
          module?: Database["public"]["Enums"]["ai_module"] | null
          output_tokens?: number | null
          quality_score?: number | null
          tenant_id: string
          total_tokens?: number | null
          user_id?: string | null
          variant: string
        }
        Update: {
          ab_test_id?: string
          ai_generation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          estimated_cost?: number | null
          feedback?: Database["public"]["Enums"]["ai_feedback"] | null
          had_error?: boolean | null
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          metadata?: Json | null
          model_id?: string
          module?: Database["public"]["Enums"]["ai_module"] | null
          output_tokens?: number | null
          quality_score?: number | null
          tenant_id?: string
          total_tokens?: number | null
          user_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_ab_test_results_ab_test_id_fkey"
            columns: ["ab_test_id"]
            isOneToOne: false
            referencedRelation: "ai_ab_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_test_results_ai_generation_id_fkey"
            columns: ["ai_generation_id"]
            isOneToOne: false
            referencedRelation: "ai_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_test_results_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_test_results_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_ab_test_results_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_test_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_ab_tests: {
        Row: {
          auto_apply_winner: boolean | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          ends_at: string | null
          hypothesis: string | null
          id: string
          metadata: Json | null
          module: Database["public"]["Enums"]["ai_module"]
          name: string
          notes: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["ab_test_status"] | null
          target_sample_size: number | null
          tenant_id: string
          updated_at: string | null
          variant_a_avg_latency_ms: number | null
          variant_a_avg_tokens: number | null
          variant_a_discarded: number | null
          variant_a_edited: number | null
          variant_a_error_count: number | null
          variant_a_label: string | null
          variant_a_max_tokens: number | null
          variant_a_model_id: string
          variant_a_quality_score: number | null
          variant_a_requests: number | null
          variant_a_system_prompt: string | null
          variant_a_temperature: number | null
          variant_a_thumbs_down: number | null
          variant_a_thumbs_up: number | null
          variant_a_total_cost: number | null
          variant_a_traffic_pct: number
          variant_a_used_as_is: number | null
          variant_b_avg_latency_ms: number | null
          variant_b_avg_tokens: number | null
          variant_b_discarded: number | null
          variant_b_edited: number | null
          variant_b_error_count: number | null
          variant_b_label: string | null
          variant_b_max_tokens: number | null
          variant_b_model_id: string
          variant_b_quality_score: number | null
          variant_b_requests: number | null
          variant_b_system_prompt: string | null
          variant_b_temperature: number | null
          variant_b_thumbs_down: number | null
          variant_b_thumbs_up: number | null
          variant_b_total_cost: number | null
          variant_b_traffic_pct: number
          variant_b_used_as_is: number | null
          winner_reason: string | null
          winning_variant: string | null
        }
        Insert: {
          auto_apply_winner?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          hypothesis?: string | null
          id?: string
          metadata?: Json | null
          module: Database["public"]["Enums"]["ai_module"]
          name: string
          notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ab_test_status"] | null
          target_sample_size?: number | null
          tenant_id: string
          updated_at?: string | null
          variant_a_avg_latency_ms?: number | null
          variant_a_avg_tokens?: number | null
          variant_a_discarded?: number | null
          variant_a_edited?: number | null
          variant_a_error_count?: number | null
          variant_a_label?: string | null
          variant_a_max_tokens?: number | null
          variant_a_model_id: string
          variant_a_quality_score?: number | null
          variant_a_requests?: number | null
          variant_a_system_prompt?: string | null
          variant_a_temperature?: number | null
          variant_a_thumbs_down?: number | null
          variant_a_thumbs_up?: number | null
          variant_a_total_cost?: number | null
          variant_a_traffic_pct?: number
          variant_a_used_as_is?: number | null
          variant_b_avg_latency_ms?: number | null
          variant_b_avg_tokens?: number | null
          variant_b_discarded?: number | null
          variant_b_edited?: number | null
          variant_b_error_count?: number | null
          variant_b_label?: string | null
          variant_b_max_tokens?: number | null
          variant_b_model_id: string
          variant_b_quality_score?: number | null
          variant_b_requests?: number | null
          variant_b_system_prompt?: string | null
          variant_b_temperature?: number | null
          variant_b_thumbs_down?: number | null
          variant_b_thumbs_up?: number | null
          variant_b_total_cost?: number | null
          variant_b_traffic_pct?: number
          variant_b_used_as_is?: number | null
          winner_reason?: string | null
          winning_variant?: string | null
        }
        Update: {
          auto_apply_winner?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          hypothesis?: string | null
          id?: string
          metadata?: Json | null
          module?: Database["public"]["Enums"]["ai_module"]
          name?: string
          notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["ab_test_status"] | null
          target_sample_size?: number | null
          tenant_id?: string
          updated_at?: string | null
          variant_a_avg_latency_ms?: number | null
          variant_a_avg_tokens?: number | null
          variant_a_discarded?: number | null
          variant_a_edited?: number | null
          variant_a_error_count?: number | null
          variant_a_label?: string | null
          variant_a_max_tokens?: number | null
          variant_a_model_id?: string
          variant_a_quality_score?: number | null
          variant_a_requests?: number | null
          variant_a_system_prompt?: string | null
          variant_a_temperature?: number | null
          variant_a_thumbs_down?: number | null
          variant_a_thumbs_up?: number | null
          variant_a_total_cost?: number | null
          variant_a_traffic_pct?: number
          variant_a_used_as_is?: number | null
          variant_b_avg_latency_ms?: number | null
          variant_b_avg_tokens?: number | null
          variant_b_discarded?: number | null
          variant_b_edited?: number | null
          variant_b_error_count?: number | null
          variant_b_label?: string | null
          variant_b_max_tokens?: number | null
          variant_b_model_id?: string
          variant_b_quality_score?: number | null
          variant_b_requests?: number | null
          variant_b_system_prompt?: string | null
          variant_b_temperature?: number | null
          variant_b_thumbs_down?: number | null
          variant_b_thumbs_up?: number | null
          variant_b_total_cost?: number | null
          variant_b_traffic_pct?: number
          variant_b_used_as_is?: number | null
          winner_reason?: string | null
          winning_variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_ab_tests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_tests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_ab_tests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_tests_variant_a_model_id_fkey"
            columns: ["variant_a_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_ab_tests_variant_b_model_id_fkey"
            columns: ["variant_b_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_api_keys: {
        Row: {
          api_key_encrypted: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_alias: string | null
          last_error: string | null
          last_error_at: string | null
          last_used_at: string | null
          metadata: Json | null
          notes: string | null
          provider: Database["public"]["Enums"]["ai_provider"]
          requests_per_minute: number | null
          rotated_from: string | null
          tenant_id: string | null
          tokens_per_minute: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_alias?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_used_at?: string | null
          metadata?: Json | null
          notes?: string | null
          provider: Database["public"]["Enums"]["ai_provider"]
          requests_per_minute?: number | null
          rotated_from?: string | null
          tenant_id?: string | null
          tokens_per_minute?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_alias?: string | null
          last_error?: string | null
          last_error_at?: string | null
          last_used_at?: string | null
          metadata?: Json | null
          notes?: string | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          requests_per_minute?: number | null
          rotated_from?: string | null
          tenant_id?: string | null
          tokens_per_minute?: number | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_api_keys_rotated_from_fkey"
            columns: ["rotated_from"]
            isOneToOne: false
            referencedRelation: "ai_api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_api_keys_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          message_count: number | null
          messages: Json | null
          metadata: Json | null
          model_key: string | null
          project_id: string | null
          system_prompt: string | null
          tenant_id: string
          title: string | null
          total_cost: number | null
          total_input_tokens: number | null
          total_output_tokens: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          messages?: Json | null
          metadata?: Json | null
          model_key?: string | null
          project_id?: string | null
          system_prompt?: string | null
          tenant_id: string
          title?: string | null
          total_cost?: number | null
          total_input_tokens?: number | null
          total_output_tokens?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_count?: number | null
          messages?: Json | null
          metadata?: Json | null
          model_key?: string | null
          project_id?: string | null
          system_prompt?: string | null
          tenant_id?: string
          title?: string | null
          total_cost?: number | null
          total_input_tokens?: number | null
          total_output_tokens?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ai_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generations: {
        Row: {
          ab_test_id: string | null
          ab_variant: string | null
          client_id: string | null
          created_at: string | null
          duration_ms: number | null
          edited_output: string | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          estimated_cost: number | null
          feedback: Database["public"]["Enums"]["ai_feedback"] | null
          feedback_notes: string | null
          generation_type: Database["public"]["Enums"]["ai_generation_type"]
          id: string
          input_data: Json | null
          input_tokens: number | null
          metadata: Json | null
          model_key: string
          module: Database["public"]["Enums"]["ai_module"] | null
          output: string | null
          output_data: Json | null
          output_tokens: number | null
          parent_generation_id: string | null
          project_id: string | null
          prompt: string
          provider: Database["public"]["Enums"]["ai_provider"] | null
          routing_strategy:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt: string | null
          tenant_id: string
          total_tokens: number | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          ab_test_id?: string | null
          ab_variant?: string | null
          client_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          edited_output?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          estimated_cost?: number | null
          feedback?: Database["public"]["Enums"]["ai_feedback"] | null
          feedback_notes?: string | null
          generation_type: Database["public"]["Enums"]["ai_generation_type"]
          id?: string
          input_data?: Json | null
          input_tokens?: number | null
          metadata?: Json | null
          model_key: string
          module?: Database["public"]["Enums"]["ai_module"] | null
          output?: string | null
          output_data?: Json | null
          output_tokens?: number | null
          parent_generation_id?: string | null
          project_id?: string | null
          prompt: string
          provider?: Database["public"]["Enums"]["ai_provider"] | null
          routing_strategy?:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt?: string | null
          tenant_id: string
          total_tokens?: number | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          ab_test_id?: string | null
          ab_variant?: string | null
          client_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          edited_output?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          estimated_cost?: number | null
          feedback?: Database["public"]["Enums"]["ai_feedback"] | null
          feedback_notes?: string | null
          generation_type?: Database["public"]["Enums"]["ai_generation_type"]
          id?: string
          input_data?: Json | null
          input_tokens?: number | null
          metadata?: Json | null
          model_key?: string
          module?: Database["public"]["Enums"]["ai_module"] | null
          output?: string | null
          output_data?: Json | null
          output_tokens?: number | null
          parent_generation_id?: string | null
          project_id?: string | null
          prompt?: string
          provider?: Database["public"]["Enums"]["ai_provider"] | null
          routing_strategy?:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt?: string | null
          tenant_id?: string
          total_tokens?: number | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_generations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generations_parent_generation_id_fkey"
            columns: ["parent_generation_id"]
            isOneToOne: false
            referencedRelation: "ai_generations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "ai_generations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_generations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_registry: {
        Row: {
          api_base_url: string | null
          api_model_id: string
          api_version: string | null
          avg_latency_ms: number | null
          avg_quality_score: number | null
          cached_input_price_per_million: number | null
          capabilities: Json | null
          created_at: string | null
          deprecated_at: string | null
          display_name: string
          id: string
          input_price_per_million: number | null
          is_active: boolean | null
          is_available: boolean | null
          max_input_tokens: number | null
          max_output_tokens: number | null
          metadata: Json | null
          model_key: string
          notes: string | null
          output_price_per_million: number | null
          provider: Database["public"]["Enums"]["ai_provider"]
          reliability_percentage: number | null
          sunset_date: string | null
          supports_json_mode: boolean | null
          supports_streaming: boolean | null
          supports_system_prompt: boolean | null
          supports_tool_use: boolean | null
          supports_vision: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_base_url?: string | null
          api_model_id: string
          api_version?: string | null
          avg_latency_ms?: number | null
          avg_quality_score?: number | null
          cached_input_price_per_million?: number | null
          capabilities?: Json | null
          created_at?: string | null
          deprecated_at?: string | null
          display_name: string
          id?: string
          input_price_per_million?: number | null
          is_active?: boolean | null
          is_available?: boolean | null
          max_input_tokens?: number | null
          max_output_tokens?: number | null
          metadata?: Json | null
          model_key: string
          notes?: string | null
          output_price_per_million?: number | null
          provider: Database["public"]["Enums"]["ai_provider"]
          reliability_percentage?: number | null
          sunset_date?: string | null
          supports_json_mode?: boolean | null
          supports_streaming?: boolean | null
          supports_system_prompt?: boolean | null
          supports_tool_use?: boolean | null
          supports_vision?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_base_url?: string | null
          api_model_id?: string
          api_version?: string | null
          avg_latency_ms?: number | null
          avg_quality_score?: number | null
          cached_input_price_per_million?: number | null
          capabilities?: Json | null
          created_at?: string | null
          deprecated_at?: string | null
          display_name?: string
          id?: string
          input_price_per_million?: number | null
          is_active?: boolean | null
          is_available?: boolean | null
          max_input_tokens?: number | null
          max_output_tokens?: number | null
          metadata?: Json | null
          model_key?: string
          notes?: string | null
          output_price_per_million?: number | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          reliability_percentage?: number | null
          sunset_date?: string | null
          supports_json_mode?: boolean | null
          supports_streaming?: boolean | null
          supports_system_prompt?: boolean | null
          supports_tool_use?: boolean | null
          supports_vision?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_module_routing: {
        Row: {
          created_at: string | null
          current_month_spend: number | null
          fallback_model_id: string | null
          frequency_penalty: number | null
          id: string
          is_active: boolean | null
          max_cost_per_day: number | null
          max_cost_per_request: number | null
          max_requests_per_day: number | null
          max_requests_per_minute: number | null
          max_tokens: number | null
          max_tokens_per_minute: number | null
          maximum_latency_ms: number | null
          metadata: Json | null
          minimum_quality_score: number | null
          module: Database["public"]["Enums"]["ai_module"]
          monthly_budget: number | null
          notes: string | null
          presence_penalty: number | null
          primary_model_id: string
          routing_strategy:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt_override: string | null
          temperature: number | null
          tenant_id: string
          top_p: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_month_spend?: number | null
          fallback_model_id?: string | null
          frequency_penalty?: number | null
          id?: string
          is_active?: boolean | null
          max_cost_per_day?: number | null
          max_cost_per_request?: number | null
          max_requests_per_day?: number | null
          max_requests_per_minute?: number | null
          max_tokens?: number | null
          max_tokens_per_minute?: number | null
          maximum_latency_ms?: number | null
          metadata?: Json | null
          minimum_quality_score?: number | null
          module: Database["public"]["Enums"]["ai_module"]
          monthly_budget?: number | null
          notes?: string | null
          presence_penalty?: number | null
          primary_model_id: string
          routing_strategy?:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt_override?: string | null
          temperature?: number | null
          tenant_id: string
          top_p?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_month_spend?: number | null
          fallback_model_id?: string | null
          frequency_penalty?: number | null
          id?: string
          is_active?: boolean | null
          max_cost_per_day?: number | null
          max_cost_per_request?: number | null
          max_requests_per_day?: number | null
          max_requests_per_minute?: number | null
          max_tokens?: number | null
          max_tokens_per_minute?: number | null
          maximum_latency_ms?: number | null
          metadata?: Json | null
          minimum_quality_score?: number | null
          module?: Database["public"]["Enums"]["ai_module"]
          monthly_budget?: number | null
          notes?: string | null
          presence_penalty?: number | null
          primary_model_id?: string
          routing_strategy?:
            | Database["public"]["Enums"]["ai_routing_strategy"]
            | null
          system_prompt_override?: string | null
          temperature?: number | null
          tenant_id?: string
          top_p?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_module_routing_fallback_model_id_fkey"
            columns: ["fallback_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_module_routing_primary_model_id_fkey"
            columns: ["primary_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model_registry"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_module_routing_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_module_routing_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_templates: {
        Row: {
          created_at: string | null
          description: string | null
          generation_type: Database["public"]["Enums"]["ai_generation_type"]
          id: string
          is_active: boolean | null
          is_default: boolean | null
          max_tokens: number | null
          metadata: Json | null
          model_key: string | null
          name: string
          system_prompt: string | null
          tags: string[] | null
          temperature: number | null
          tenant_id: string | null
          updated_at: string | null
          usage_count: number | null
          user_prompt_template: string
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          generation_type: Database["public"]["Enums"]["ai_generation_type"]
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model_key?: string | null
          name: string
          system_prompt?: string | null
          tags?: string[] | null
          temperature?: number | null
          tenant_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_prompt_template: string
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          generation_type?: Database["public"]["Enums"]["ai_generation_type"]
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model_key?: string | null
          name?: string
          system_prompt?: string | null
          tags?: string[] | null
          temperature?: number | null
          tenant_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_prompt_template?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "ai_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          event_category: string | null
          event_name: string
          id: string
          ip_address: unknown
          os: string | null
          page_url: string | null
          properties: Json | null
          referrer_url: string | null
          session_id: string | null
          state: string | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_category?: string | null
          event_name: string
          id?: string
          ip_address?: unknown
          os?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string | null
          state?: string | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_category?: string | null
          event_name?: string
          id?: string
          ip_address?: unknown
          os?: string | null
          page_url?: string | null
          properties?: Json | null
          referrer_url?: string | null
          session_id?: string | null
          state?: string | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "analytics_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string | null
          delay_minutes: number | null
          description: string | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_run_at: string | null
          metadata: Json | null
          name: string
          run_count: number | null
          tenant_id: string
          trigger_conditions: Json | null
          trigger_event: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
        }
        Insert: {
          action_config?: Json
          action_type: string
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_run_at?: string | null
          metadata?: Json | null
          name: string
          run_count?: number | null
          tenant_id: string
          trigger_conditions?: Json | null
          trigger_event: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_run_at?: string | null
          metadata?: Json | null
          name?: string
          run_count?: number | null
          tenant_id?: string
          trigger_conditions?: Json | null
          trigger_event?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "automation_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          auto_remind: boolean | null
          certification_number: string | null
          certification_type: Database["public"]["Enums"]["certification_type"]
          created_at: string | null
          document_storage_path: string | null
          document_url: string | null
          employee_id: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          metadata: Json | null
          name: string
          notes: string | null
          remind_days_before: number | null
          renewal_cost: number | null
          renewal_date: string | null
          renewal_requirements: string | null
          status: Database["public"]["Enums"]["certification_status"] | null
          subcontractor_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          auto_remind?: boolean | null
          certification_number?: string | null
          certification_type: Database["public"]["Enums"]["certification_type"]
          created_at?: string | null
          document_storage_path?: string | null
          document_url?: string | null
          employee_id?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          remind_days_before?: number | null
          renewal_cost?: number | null
          renewal_date?: string | null
          renewal_requirements?: string | null
          status?: Database["public"]["Enums"]["certification_status"] | null
          subcontractor_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          auto_remind?: boolean | null
          certification_number?: string | null
          certification_type?: Database["public"]["Enums"]["certification_type"]
          created_at?: string | null
          document_storage_path?: string | null
          document_url?: string | null
          employee_id?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          remind_days_before?: number | null
          renewal_cost?: number | null
          renewal_date?: string | null
          renewal_requirements?: string | null
          status?: Database["public"]["Enums"]["certification_status"] | null
          subcontractor_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "certifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      change_orders: {
        Row: {
          ai_generated: boolean | null
          ai_impact_analysis: string | null
          approved_at: string | null
          approved_by: string | null
          change_order_number: string | null
          client_approved_at: string | null
          client_approved_by: string | null
          client_id: string | null
          client_notes: string | null
          contract_id: string | null
          cost_impact: number | null
          created_at: string | null
          declined_at: string | null
          declined_by: string | null
          declined_reason: string | null
          deleted_at: string | null
          description: string | null
          id: string
          internal_notes: string | null
          line_items: Json | null
          metadata: Json | null
          original_amount: number | null
          project_id: string
          reason: Database["public"]["Enums"]["change_order_reason"] | null
          requested_at: string | null
          requested_by: string | null
          requires_signature: boolean | null
          revised_completion_date: string | null
          revised_contract_amount: number | null
          schedule_impact_days: number | null
          scope_additions: string | null
          scope_deletions: string | null
          signature_envelope_id: string | null
          signature_provider: string | null
          signed_at: string | null
          status: Database["public"]["Enums"]["change_order_status"] | null
          tags: string[] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_impact_analysis?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_order_number?: string | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          client_id?: string | null
          client_notes?: string | null
          contract_id?: string | null
          cost_impact?: number | null
          created_at?: string | null
          declined_at?: string | null
          declined_by?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          line_items?: Json | null
          metadata?: Json | null
          original_amount?: number | null
          project_id: string
          reason?: Database["public"]["Enums"]["change_order_reason"] | null
          requested_at?: string | null
          requested_by?: string | null
          requires_signature?: boolean | null
          revised_completion_date?: string | null
          revised_contract_amount?: number | null
          schedule_impact_days?: number | null
          scope_additions?: string | null
          scope_deletions?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["change_order_status"] | null
          tags?: string[] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_impact_analysis?: string | null
          approved_at?: string | null
          approved_by?: string | null
          change_order_number?: string | null
          client_approved_at?: string | null
          client_approved_by?: string | null
          client_id?: string | null
          client_notes?: string | null
          contract_id?: string | null
          cost_impact?: number | null
          created_at?: string | null
          declined_at?: string | null
          declined_by?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          line_items?: Json | null
          metadata?: Json | null
          original_amount?: number | null
          project_id?: string
          reason?: Database["public"]["Enums"]["change_order_reason"] | null
          requested_at?: string | null
          requested_by?: string | null
          requires_signature?: boolean | null
          revised_completion_date?: string | null
          revised_contract_amount?: number | null
          schedule_impact_days?: number | null
          scope_additions?: string | null
          scope_deletions?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["change_order_status"] | null
          tags?: string[] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "change_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_declined_by_fkey"
            columns: ["declined_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "change_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "change_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          can_approve_payments: boolean | null
          can_approve_work: boolean | null
          can_sign_contracts: boolean | null
          client_id: string
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_primary: boolean | null
          last_name: string | null
          notes: string | null
          phone: string | null
          phone_secondary: string | null
          preferred_contact:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          relationship: Database["public"]["Enums"]["relationship_type"] | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          can_approve_payments?: boolean | null
          can_approve_work?: boolean | null
          can_sign_contracts?: boolean | null
          client_id: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          phone_secondary?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          relationship?: Database["public"]["Enums"]["relationship_type"] | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          can_approve_payments?: boolean | null
          can_approve_work?: boolean | null
          can_sign_contracts?: boolean | null
          client_id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_primary?: boolean | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          phone_secondary?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          relationship?: Database["public"]["Enums"]["relationship_type"] | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "client_contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_notes: {
        Row: {
          author_id: string | null
          client_id: string | null
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_pinned: boolean | null
          is_private: boolean | null
          lead_id: string | null
          metadata: Json | null
          note_type: string | null
          tags: string[] | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          client_id?: string | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_private?: boolean | null
          lead_id?: string | null
          metadata?: Json | null
          note_type?: string | null
          tags?: string[] | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          client_id?: string | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          is_private?: boolean | null
          lead_id?: string | null
          metadata?: Json | null
          note_type?: string | null
          tags?: string[] | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "client_notes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          assigned_to: string | null
          average_project_value: number | null
          best_time_to_contact: string | null
          business_ein: string | null
          business_license: string | null
          city: string | null
          client_type: Database["public"]["Enums"]["client_type"] | null
          company_name: string | null
          country: string | null
          county: string | null
          created_at: string | null
          credit_limit: number | null
          custom_fields: Json | null
          deleted_at: string | null
          display_name: string | null
          do_not_contact_reason: string | null
          email: string | null
          first_name: string | null
          id: string
          internal_notes: string | null
          is_do_not_contact: boolean | null
          is_vip: boolean | null
          last_contact_date: string | null
          last_name: string | null
          last_payment_date: string | null
          last_project_date: string | null
          latitude: number | null
          lifetime_value: number | null
          longitude: number | null
          metadata: Json | null
          net_terms_days: number | null
          payment_reliability_score: number | null
          phone: string | null
          phone_secondary: string | null
          portal_enrolled: boolean | null
          portal_enrolled_at: string | null
          portal_last_login: string | null
          preferred_contact:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          purchase_order_required: boolean | null
          referral_source: Database["public"]["Enums"]["lead_source"] | null
          referred_by_client_id: string | null
          satisfaction_score: number | null
          state: string | null
          tags: string[] | null
          tax_exempt: boolean | null
          tax_exempt_id: string | null
          tenant_id: string
          total_outstanding: number | null
          total_projects: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          assigned_to?: string | null
          average_project_value?: number | null
          best_time_to_contact?: string | null
          business_ein?: string | null
          business_license?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["client_type"] | null
          company_name?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          display_name?: string | null
          do_not_contact_reason?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          internal_notes?: string | null
          is_do_not_contact?: boolean | null
          is_vip?: boolean | null
          last_contact_date?: string | null
          last_name?: string | null
          last_payment_date?: string | null
          last_project_date?: string | null
          latitude?: number | null
          lifetime_value?: number | null
          longitude?: number | null
          metadata?: Json | null
          net_terms_days?: number | null
          payment_reliability_score?: number | null
          phone?: string | null
          phone_secondary?: string | null
          portal_enrolled?: boolean | null
          portal_enrolled_at?: string | null
          portal_last_login?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          purchase_order_required?: boolean | null
          referral_source?: Database["public"]["Enums"]["lead_source"] | null
          referred_by_client_id?: string | null
          satisfaction_score?: number | null
          state?: string | null
          tags?: string[] | null
          tax_exempt?: boolean | null
          tax_exempt_id?: string | null
          tenant_id: string
          total_outstanding?: number | null
          total_projects?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          assigned_to?: string | null
          average_project_value?: number | null
          best_time_to_contact?: string | null
          business_ein?: string | null
          business_license?: string | null
          city?: string | null
          client_type?: Database["public"]["Enums"]["client_type"] | null
          company_name?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          credit_limit?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          display_name?: string | null
          do_not_contact_reason?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          internal_notes?: string | null
          is_do_not_contact?: boolean | null
          is_vip?: boolean | null
          last_contact_date?: string | null
          last_name?: string | null
          last_payment_date?: string | null
          last_project_date?: string | null
          latitude?: number | null
          lifetime_value?: number | null
          longitude?: number | null
          metadata?: Json | null
          net_terms_days?: number | null
          payment_reliability_score?: number | null
          phone?: string | null
          phone_secondary?: string | null
          portal_enrolled?: boolean | null
          portal_enrolled_at?: string | null
          portal_last_login?: string | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          purchase_order_required?: boolean | null
          referral_source?: Database["public"]["Enums"]["lead_source"] | null
          referred_by_client_id?: string | null
          satisfaction_score?: number | null
          state?: string | null
          tags?: string[] | null
          tax_exempt?: boolean | null
          tax_exempt_id?: string | null
          tenant_id?: string
          total_outstanding?: number | null
          total_projects?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_referred_by_client_id_fkey"
            columns: ["referred_by_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          available_variables: Json | null
          body: string
          body_html: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          created_at: string | null
          delay_minutes: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_automated: boolean | null
          is_default: boolean | null
          metadata: Json | null
          name: string
          subject: string | null
          tags: string[] | null
          tenant_id: string | null
          trigger_event: Database["public"]["Enums"]["notification_type"] | null
          updated_at: string | null
        }
        Insert: {
          available_variables?: Json | null
          body: string
          body_html?: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          subject?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          trigger_event?:
            | Database["public"]["Enums"]["notification_type"]
            | null
          updated_at?: string | null
        }
        Update: {
          available_variables?: Json | null
          body?: string
          body_html?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string | null
          delay_minutes?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_automated?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          subject?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          trigger_event?:
            | Database["public"]["Enums"]["notification_type"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "communication_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          body_template: string
          clauses: Json | null
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          metadata: Json | null
          name: string
          notes: string | null
          project_types: Database["public"]["Enums"]["project_type"][] | null
          tags: string[] | null
          tenant_id: string | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          body_template: string
          clauses?: Json | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          notes?: string | null
          project_types?: Database["public"]["Enums"]["project_type"][] | null
          tags?: string[] | null
          tenant_id?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          body_template?: string
          clauses?: Json | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          project_types?: Database["public"]["Enums"]["project_type"][] | null
          tags?: string[] | null
          tenant_id?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "contract_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          ai_generated: boolean | null
          ai_model_key: string | null
          ai_review_notes: string | null
          bonus_per_day: number | null
          change_order_total: number | null
          clauses: Json | null
          client_address: string | null
          client_id: string
          client_name: string | null
          client_signature_ip: string | null
          client_signed_at: string | null
          client_signed_by: string | null
          contract_body: string | null
          contract_number: string | null
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          contractor_address: string | null
          contractor_license: string | null
          contractor_name: string | null
          contractor_signature_ip: string | null
          contractor_signed_at: string | null
          contractor_signed_by: string | null
          cost_plus_fee_type: string | null
          cost_plus_fee_value: number | null
          created_at: string | null
          current_amount: number | null
          custom_fields: Json | null
          deleted_at: string | null
          deposit_amount: number | null
          deposit_received: boolean | null
          deposit_required: boolean | null
          document_storage_path: string | null
          document_url: string | null
          estimate_id: string | null
          exclusions: string | null
          final_completion_date: string | null
          fully_executed_at: string | null
          general_conditions: string | null
          guaranteed_maximum_price: number | null
          id: string
          internal_notes: string | null
          late_fee_flat: number | null
          late_fee_percentage: number | null
          liquidated_damages_per_day: number | null
          metadata: Json | null
          original_amount: number | null
          payment_terms: string | null
          payment_terms_days: number | null
          prepared_by: string | null
          project_id: string | null
          proposal_id: string | null
          requires_signature: boolean | null
          retainage_amount: number | null
          retainage_percentage: number | null
          reviewed_by: string | null
          scope_of_work: string | null
          sent_at: string | null
          signature_envelope_id: string | null
          signature_provider: string | null
          special_conditions: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          substantial_completion_date: string | null
          tags: string[] | null
          template_id: string | null
          tenant_id: string
          terminated_at: string | null
          terminated_by: string | null
          termination_reason: string | null
          title: string
          updated_at: string | null
          viewed_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_model_key?: string | null
          ai_review_notes?: string | null
          bonus_per_day?: number | null
          change_order_total?: number | null
          clauses?: Json | null
          client_address?: string | null
          client_id: string
          client_name?: string | null
          client_signature_ip?: string | null
          client_signed_at?: string | null
          client_signed_by?: string | null
          contract_body?: string | null
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          contractor_address?: string | null
          contractor_license?: string | null
          contractor_name?: string | null
          contractor_signature_ip?: string | null
          contractor_signed_at?: string | null
          contractor_signed_by?: string | null
          cost_plus_fee_type?: string | null
          cost_plus_fee_value?: number | null
          created_at?: string | null
          current_amount?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          deposit_amount?: number | null
          deposit_received?: boolean | null
          deposit_required?: boolean | null
          document_storage_path?: string | null
          document_url?: string | null
          estimate_id?: string | null
          exclusions?: string | null
          final_completion_date?: string | null
          fully_executed_at?: string | null
          general_conditions?: string | null
          guaranteed_maximum_price?: number | null
          id?: string
          internal_notes?: string | null
          late_fee_flat?: number | null
          late_fee_percentage?: number | null
          liquidated_damages_per_day?: number | null
          metadata?: Json | null
          original_amount?: number | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          prepared_by?: string | null
          project_id?: string | null
          proposal_id?: string | null
          requires_signature?: boolean | null
          retainage_amount?: number | null
          retainage_percentage?: number | null
          reviewed_by?: string | null
          scope_of_work?: string | null
          sent_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          special_conditions?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          substantial_completion_date?: string | null
          tags?: string[] | null
          template_id?: string | null
          tenant_id: string
          terminated_at?: string | null
          terminated_by?: string | null
          termination_reason?: string | null
          title: string
          updated_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_model_key?: string | null
          ai_review_notes?: string | null
          bonus_per_day?: number | null
          change_order_total?: number | null
          clauses?: Json | null
          client_address?: string | null
          client_id?: string
          client_name?: string | null
          client_signature_ip?: string | null
          client_signed_at?: string | null
          client_signed_by?: string | null
          contract_body?: string | null
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          contractor_address?: string | null
          contractor_license?: string | null
          contractor_name?: string | null
          contractor_signature_ip?: string | null
          contractor_signed_at?: string | null
          contractor_signed_by?: string | null
          cost_plus_fee_type?: string | null
          cost_plus_fee_value?: number | null
          created_at?: string | null
          current_amount?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          deposit_amount?: number | null
          deposit_received?: boolean | null
          deposit_required?: boolean | null
          document_storage_path?: string | null
          document_url?: string | null
          estimate_id?: string | null
          exclusions?: string | null
          final_completion_date?: string | null
          fully_executed_at?: string | null
          general_conditions?: string | null
          guaranteed_maximum_price?: number | null
          id?: string
          internal_notes?: string | null
          late_fee_flat?: number | null
          late_fee_percentage?: number | null
          liquidated_damages_per_day?: number | null
          metadata?: Json | null
          original_amount?: number | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          prepared_by?: string | null
          project_id?: string | null
          proposal_id?: string | null
          requires_signature?: boolean | null
          retainage_amount?: number | null
          retainage_percentage?: number | null
          reviewed_by?: string | null
          scope_of_work?: string | null
          sent_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          special_conditions?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"] | null
          substantial_completion_date?: string | null
          tags?: string[] | null
          template_id?: string | null
          tenant_id?: string
          terminated_at?: string | null
          terminated_by?: string | null
          termination_reason?: string | null
          title?: string
          updated_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "contracts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_members: {
        Row: {
          created_at: string | null
          crew_id: string
          employee_id: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          left_at: string | null
          metadata: Json | null
          role: Database["public"]["Enums"]["crew_role"] | null
          subcontractor_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          crew_id: string
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["crew_role"] | null
          subcontractor_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          crew_id?: string
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          metadata?: Json | null
          role?: Database["public"]["Enums"]["crew_role"] | null
          subcontractor_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_members_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_members_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "crew_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crews: {
        Row: {
          created_at: string | null
          description: string | null
          foreman_id: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          notes: string | null
          tenant_id: string
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          foreman_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          notes?: string | null
          tenant_id: string
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          foreman_id?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          tenant_id?: string
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crews_foreman_id_fkey"
            columns: ["foreman_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crews_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "crews_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          ai_concerns: string | null
          ai_summary: string | null
          author_id: string | null
          client_interactions: string | null
          completion_percentage: number | null
          created_at: string | null
          crew_details: Json | null
          delay_hours: number | null
          delays: string | null
          employees_on_site: number | null
          equipment_details: Json | null
          equipment_used: string | null
          hours_worked: number | null
          humidity: number | null
          id: string
          internal_notes: string | null
          log_date: string
          materials_details: Json | null
          materials_received: string | null
          materials_used: string | null
          metadata: Json | null
          notes: string | null
          overtime_hours: number | null
          phase_status_updates: Json | null
          photo_count: number | null
          photos: Json | null
          precipitation: string | null
          project_id: string
          quality_issues: string | null
          safety_incidents: string | null
          subcontractors_on_site: number | null
          summary: string | null
          temperature_high: number | null
          temperature_low: number | null
          tenant_id: string
          updated_at: string | null
          visible_to_client: boolean | null
          visitors: string | null
          weather_condition: string | null
          weather_data: Json | null
          weather_impact_on_work: string | null
          wind_speed: number | null
          work_areas: string | null
          work_performed: string | null
        }
        Insert: {
          ai_concerns?: string | null
          ai_summary?: string | null
          author_id?: string | null
          client_interactions?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          crew_details?: Json | null
          delay_hours?: number | null
          delays?: string | null
          employees_on_site?: number | null
          equipment_details?: Json | null
          equipment_used?: string | null
          hours_worked?: number | null
          humidity?: number | null
          id?: string
          internal_notes?: string | null
          log_date: string
          materials_details?: Json | null
          materials_received?: string | null
          materials_used?: string | null
          metadata?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          phase_status_updates?: Json | null
          photo_count?: number | null
          photos?: Json | null
          precipitation?: string | null
          project_id: string
          quality_issues?: string | null
          safety_incidents?: string | null
          subcontractors_on_site?: number | null
          summary?: string | null
          temperature_high?: number | null
          temperature_low?: number | null
          tenant_id: string
          updated_at?: string | null
          visible_to_client?: boolean | null
          visitors?: string | null
          weather_condition?: string | null
          weather_data?: Json | null
          weather_impact_on_work?: string | null
          wind_speed?: number | null
          work_areas?: string | null
          work_performed?: string | null
        }
        Update: {
          ai_concerns?: string | null
          ai_summary?: string | null
          author_id?: string | null
          client_interactions?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          crew_details?: Json | null
          delay_hours?: number | null
          delays?: string | null
          employees_on_site?: number | null
          equipment_details?: Json | null
          equipment_used?: string | null
          hours_worked?: number | null
          humidity?: number | null
          id?: string
          internal_notes?: string | null
          log_date?: string
          materials_details?: Json | null
          materials_received?: string | null
          materials_used?: string | null
          metadata?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          phase_status_updates?: Json | null
          photo_count?: number | null
          photos?: Json | null
          precipitation?: string | null
          project_id?: string
          quality_issues?: string | null
          safety_incidents?: string | null
          subcontractors_on_site?: number | null
          summary?: string | null
          temperature_high?: number | null
          temperature_low?: number | null
          tenant_id?: string
          updated_at?: string | null
          visible_to_client?: boolean | null
          visitors?: string | null
          weather_condition?: string | null
          weather_data?: Json | null
          weather_impact_on_work?: string | null
          wind_speed?: number | null
          work_areas?: string | null
          work_performed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "daily_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      document_folders: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_client_visible: boolean | null
          metadata: Json | null
          name: string
          parent_id: string | null
          project_id: string | null
          sort_order: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_client_visible?: boolean | null
          metadata?: Json | null
          name: string
          parent_id?: string | null
          project_id?: string | null
          sort_order?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_client_visible?: boolean | null
          metadata?: Json | null
          name?: string
          parent_id?: string | null
          project_id?: string | null
          sort_order?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "document_folders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "document_folders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          ai_analysis: Json | null
          ai_extracted_text: string | null
          ai_summary: string | null
          ai_tags: string[] | null
          client_id: string | null
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"] | null
          download_count: number | null
          employee_id: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          folder_id: string | null
          id: string
          is_client_visible: boolean | null
          is_latest: boolean | null
          metadata: Json | null
          mime_type: string | null
          parent_document_id: string | null
          project_id: string | null
          requires_signature: boolean | null
          shared_link: string | null
          shared_link_expires_at: string | null
          signature_envelope_id: string | null
          signature_status: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          storage_path: string
          storage_url: string | null
          subcontractor_id: string | null
          tags: string[] | null
          tenant_id: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_extracted_text?: string | null
          ai_summary?: string | null
          ai_tags?: string[] | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          download_count?: number | null
          employee_id?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          is_client_visible?: boolean | null
          is_latest?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          parent_document_id?: string | null
          project_id?: string | null
          requires_signature?: boolean | null
          shared_link?: string | null
          shared_link_expires_at?: string | null
          signature_envelope_id?: string | null
          signature_status?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          storage_path: string
          storage_url?: string | null
          subcontractor_id?: string | null
          tags?: string[] | null
          tenant_id: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_extracted_text?: string | null
          ai_summary?: string | null
          ai_tags?: string[] | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          download_count?: number | null
          employee_id?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          is_client_visible?: boolean | null
          is_latest?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          parent_document_id?: string | null
          project_id?: string | null
          requires_signature?: boolean | null
          shared_link?: string | null
          shared_link_expires_at?: string | null
          signature_envelope_id?: string | null
          signature_status?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          storage_path?: string
          storage_url?: string | null
          subcontractor_id?: string | null
          tags?: string[] | null
          tenant_id?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      draw_schedules: {
        Row: {
          approved_amount: number | null
          approved_by: string | null
          approved_date: string | null
          completion_percentage_required: number | null
          contract_id: string | null
          created_at: string | null
          description: string | null
          draw_number: number
          id: string
          invoice_id: string | null
          metadata: Json | null
          milestone_description: string | null
          net_amount: number | null
          notes: string | null
          paid_date: string | null
          phase_id: string | null
          project_id: string
          requested_amount: number | null
          requested_by: string | null
          requested_date: string | null
          retainage_withheld: number | null
          scheduled_amount: number
          scheduled_date: string | null
          status: Database["public"]["Enums"]["draw_schedule_status"] | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          approved_amount?: number | null
          approved_by?: string | null
          approved_date?: string | null
          completion_percentage_required?: number | null
          contract_id?: string | null
          created_at?: string | null
          description?: string | null
          draw_number: number
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          milestone_description?: string | null
          net_amount?: number | null
          notes?: string | null
          paid_date?: string | null
          phase_id?: string | null
          project_id: string
          requested_amount?: number | null
          requested_by?: string | null
          requested_date?: string | null
          retainage_withheld?: number | null
          scheduled_amount: number
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["draw_schedule_status"] | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_amount?: number | null
          approved_by?: string | null
          approved_date?: string | null
          completion_percentage_required?: number | null
          contract_id?: string | null
          created_at?: string | null
          description?: string | null
          draw_number?: number
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          milestone_description?: string | null
          net_amount?: number | null
          notes?: string | null
          paid_date?: string | null
          phase_id?: string | null
          project_id?: string
          requested_amount?: number | null
          requested_by?: string | null
          requested_date?: string | null
          retainage_withheld?: number | null
          scheduled_amount?: number
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["draw_schedule_status"] | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draw_schedules_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "draw_schedules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "draw_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "draw_schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_audiences: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_dynamic: boolean | null
          last_computed_at: string | null
          member_count: number | null
          metadata: Json | null
          name: string
          segment_rules: Json
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          last_computed_at?: string | null
          member_count?: number | null
          metadata?: Json | null
          name: string
          segment_rules?: Json
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_dynamic?: boolean | null
          last_computed_at?: string | null
          member_count?: number | null
          metadata?: Json | null
          name?: string
          segment_rules?: Json
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_audiences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_audiences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "email_audiences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience_id: string | null
          body_html: string
          body_text: string | null
          created_at: string | null
          created_by: string | null
          from_email: string | null
          from_name: string | null
          id: string
          metadata: Json | null
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          tenant_id: string
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          updated_at: string | null
        }
        Insert: {
          audience_id?: string | null
          body_html: string
          body_text?: string | null
          created_at?: string | null
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          metadata?: Json | null
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          tenant_id: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string | null
        }
        Update: {
          audience_id?: string | null
          body_html?: string
          body_text?: string | null
          created_at?: string | null
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          tenant_id?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "email_campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_email_campaigns_audience"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "email_audiences"
            referencedColumns: ["id"]
          },
        ]
      }
      email_link_clicks: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          client_id: string | null
          device_type: string | null
          email_log_id: string | null
          id: string
          ip_address: unknown
          link_url: string
          recipient_email: string | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          client_id?: string | null
          device_type?: string | null
          email_log_id?: string | null
          id?: string
          ip_address?: unknown
          link_url: string
          recipient_email?: string | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          client_id?: string | null
          device_type?: string | null
          email_log_id?: string | null
          id?: string
          ip_address?: unknown
          link_url?: string
          recipient_email?: string | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_link_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_link_clicks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_link_clicks_email_log_id_fkey"
            columns: ["email_log_id"]
            isOneToOne: false
            referencedRelation: "email_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_link_clicks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "email_link_clicks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          bcc_addresses: string[] | null
          body_html: string | null
          body_text: string | null
          bounce_reason: string | null
          bounced_at: string | null
          cc_addresses: string[] | null
          click_count: number | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_address: string
          id: string
          metadata: Json | null
          open_count: number | null
          opened_at: string | null
          provider: string | null
          provider_message_id: string | null
          reply_to: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string | null
          template_name: string | null
          tenant_id: string
          to_addresses: string[]
          unsubscribed_at: string | null
        }
        Insert: {
          bcc_addresses?: string[] | null
          body_html?: string | null
          body_text?: string | null
          bounce_reason?: string | null
          bounced_at?: string | null
          cc_addresses?: string[] | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_address: string
          id?: string
          metadata?: Json | null
          open_count?: number | null
          opened_at?: string | null
          provider?: string | null
          provider_message_id?: string | null
          reply_to?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string | null
          template_name?: string | null
          tenant_id: string
          to_addresses: string[]
          unsubscribed_at?: string | null
        }
        Update: {
          bcc_addresses?: string[] | null
          body_html?: string | null
          body_text?: string | null
          bounce_reason?: string | null
          bounced_at?: string | null
          cc_addresses?: string[] | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_address?: string
          id?: string
          metadata?: Json | null
          open_count?: number | null
          opened_at?: string | null
          provider?: string | null
          provider_message_id?: string | null
          reply_to?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string | null
          template_name?: string | null
          tenant_id?: string
          to_addresses?: string[]
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "email_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_unsubscribes: {
        Row: {
          category: string | null
          client_id: string | null
          email: string
          id: string
          reason: string | null
          tenant_id: string
          unsubscribed_at: string | null
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          email: string
          id?: string
          reason?: string | null
          tenant_id: string
          unsubscribed_at?: string | null
        }
        Update: {
          category?: string | null
          client_id?: string | null
          email?: string
          id?: string
          reason?: string | null
          tenant_id?: string
          unsubscribed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_unsubscribes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_unsubscribes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "email_unsubscribes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          assigned_equipment: Json | null
          assigned_vehicle_id: string | null
          city: string | null
          created_at: string | null
          custom_fields: Json | null
          date_of_birth: string | null
          deleted_at: string | null
          department: string | null
          direct_deposit_setup: boolean | null
          drivers_license_expiry: string | null
          drivers_license_number: string | null
          drivers_license_state: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employee_number: string | null
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          first_name: string
          hire_date: string | null
          i9_verified: boolean | null
          id: string
          last_name: string
          last_review_date: string | null
          metadata: Json | null
          middle_name: string | null
          next_review_date: string | null
          notes: string | null
          overtime_rate: number | null
          pay_frequency: Database["public"]["Enums"]["pay_frequency"] | null
          pay_rate: number | null
          pay_type: Database["public"]["Enums"]["pay_type"] | null
          performance_rating: number | null
          phone: string | null
          phone_secondary: string | null
          photo_url: string | null
          preferred_name: string | null
          shirt_size: string | null
          skill_level: string | null
          specialties: string[] | null
          ssn_last_four: string | null
          start_date: string | null
          state: string | null
          tags: string[] | null
          tenant_id: string
          termination_date: string | null
          termination_reason: string | null
          title: string | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
          user_id: string | null
          w4_on_file: boolean | null
          years_experience: number | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          assigned_equipment?: Json | null
          assigned_vehicle_id?: string | null
          city?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          date_of_birth?: string | null
          deleted_at?: string | null
          department?: string | null
          direct_deposit_setup?: boolean | null
          drivers_license_expiry?: string | null
          drivers_license_number?: string | null
          drivers_license_state?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_number?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          first_name: string
          hire_date?: string | null
          i9_verified?: boolean | null
          id?: string
          last_name: string
          last_review_date?: string | null
          metadata?: Json | null
          middle_name?: string | null
          next_review_date?: string | null
          notes?: string | null
          overtime_rate?: number | null
          pay_frequency?: Database["public"]["Enums"]["pay_frequency"] | null
          pay_rate?: number | null
          pay_type?: Database["public"]["Enums"]["pay_type"] | null
          performance_rating?: number | null
          phone?: string | null
          phone_secondary?: string | null
          photo_url?: string | null
          preferred_name?: string | null
          shirt_size?: string | null
          skill_level?: string | null
          specialties?: string[] | null
          ssn_last_four?: string | null
          start_date?: string | null
          state?: string | null
          tags?: string[] | null
          tenant_id: string
          termination_date?: string | null
          termination_reason?: string | null
          title?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          user_id?: string | null
          w4_on_file?: boolean | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          assigned_equipment?: Json | null
          assigned_vehicle_id?: string | null
          city?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          date_of_birth?: string | null
          deleted_at?: string | null
          department?: string | null
          direct_deposit_setup?: boolean | null
          drivers_license_expiry?: string | null
          drivers_license_number?: string | null
          drivers_license_state?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_number?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          first_name?: string
          hire_date?: string | null
          i9_verified?: boolean | null
          id?: string
          last_name?: string
          last_review_date?: string | null
          metadata?: Json | null
          middle_name?: string | null
          next_review_date?: string | null
          notes?: string | null
          overtime_rate?: number | null
          pay_frequency?: Database["public"]["Enums"]["pay_frequency"] | null
          pay_rate?: number | null
          pay_type?: Database["public"]["Enums"]["pay_type"] | null
          performance_rating?: number | null
          phone?: string | null
          phone_secondary?: string | null
          photo_url?: string | null
          preferred_name?: string | null
          shirt_size?: string | null
          skill_level?: string | null
          specialties?: string[] | null
          ssn_last_four?: string | null
          start_date?: string | null
          state?: string | null
          tags?: string[] | null
          tenant_id?: string
          termination_date?: string | null
          termination_reason?: string | null
          title?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          user_id?: string | null
          w4_on_file?: boolean | null
          years_experience?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employees_vehicle"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          assigned_to: string | null
          assigned_to_project: string | null
          calibration_certificate_url: string | null
          condition: Database["public"]["Enums"]["equipment_condition"] | null
          created_at: string | null
          current_value: number | null
          description: string | null
          equipment_type: Database["public"]["Enums"]["equipment_type"]
          id: string
          is_active: boolean | null
          last_calibration_date: string | null
          last_maintenance_date: string | null
          location: string | null
          maintenance_interval_days: number | null
          manufacturer: string | null
          metadata: Json | null
          model: string | null
          name: string
          next_calibration_date: string | null
          next_maintenance_date: string | null
          notes: string | null
          ownership: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date: string | null
          purchase_price: number | null
          rental_rate: number | null
          rental_vendor_id: string | null
          requires_calibration: boolean | null
          serial_number: string | null
          tags: string[] | null
          tenant_id: string
          total_hours_used: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_to_project?: string | null
          calibration_certificate_url?: string | null
          condition?: Database["public"]["Enums"]["equipment_condition"] | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          equipment_type: Database["public"]["Enums"]["equipment_type"]
          id?: string
          is_active?: boolean | null
          last_calibration_date?: string | null
          last_maintenance_date?: string | null
          location?: string | null
          maintenance_interval_days?: number | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          name: string
          next_calibration_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          ownership?: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date?: string | null
          purchase_price?: number | null
          rental_rate?: number | null
          rental_vendor_id?: string | null
          requires_calibration?: boolean | null
          serial_number?: string | null
          tags?: string[] | null
          tenant_id: string
          total_hours_used?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          assigned_to_project?: string | null
          calibration_certificate_url?: string | null
          condition?: Database["public"]["Enums"]["equipment_condition"] | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          equipment_type?: Database["public"]["Enums"]["equipment_type"]
          id?: string
          is_active?: boolean | null
          last_calibration_date?: string | null
          last_maintenance_date?: string | null
          location?: string | null
          maintenance_interval_days?: number | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          name?: string
          next_calibration_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          ownership?: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date?: string | null
          purchase_price?: number | null
          rental_rate?: number | null
          rental_vendor_id?: string | null
          requires_calibration?: boolean | null
          serial_number?: string | null
          tags?: string[] | null
          tenant_id?: string
          total_hours_used?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_assigned_to_project_fkey"
            columns: ["assigned_to_project"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "equipment_assigned_to_project_fkey"
            columns: ["assigned_to_project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_rental_vendor_id_fkey"
            columns: ["rental_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "equipment_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_line_items: {
        Row: {
          created_at: string | null
          description: string | null
          estimate_id: string
          id: string
          internal_notes: string | null
          is_alternate: boolean | null
          is_optional: boolean | null
          is_taxable: boolean | null
          item_type:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          labor_count: number | null
          labor_hours: number | null
          labor_rate: number | null
          line_order: number | null
          markup_percentage: number | null
          material_id: string | null
          metadata: Json | null
          name: string
          notes: string | null
          quantity: number | null
          section_name: string | null
          section_order: number | null
          service_catalog_id: string | null
          show_unit_price: boolean | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          tenant_id: string
          total: number | null
          unit: Database["public"]["Enums"]["material_unit"] | null
          unit_cost: number | null
          unit_price: number | null
          updated_at: string | null
          visible_to_client: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimate_id: string
          id?: string
          internal_notes?: string | null
          is_alternate?: boolean | null
          is_optional?: boolean | null
          is_taxable?: boolean | null
          item_type?:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          labor_count?: number | null
          labor_hours?: number | null
          labor_rate?: number | null
          line_order?: number | null
          markup_percentage?: number | null
          material_id?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          quantity?: number | null
          section_name?: string | null
          section_order?: number | null
          service_catalog_id?: string | null
          show_unit_price?: boolean | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id: string
          total?: number | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_cost?: number | null
          unit_price?: number | null
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimate_id?: string
          id?: string
          internal_notes?: string | null
          is_alternate?: boolean | null
          is_optional?: boolean | null
          is_taxable?: boolean | null
          item_type?:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          labor_count?: number | null
          labor_hours?: number | null
          labor_rate?: number | null
          line_order?: number | null
          markup_percentage?: number | null
          material_id?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          quantity?: number | null
          section_name?: string | null
          section_order?: number | null
          service_catalog_id?: string | null
          show_unit_price?: boolean | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id?: string
          total?: number | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_cost?: number | null
          unit_price?: number | null
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_line_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "estimate_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          accepted_at: string | null
          ai_confidence_score: number | null
          ai_generated: boolean | null
          ai_model_key: string | null
          ai_prompt: string | null
          assumptions: string | null
          client_id: string
          client_notes: string | null
          contingency_amount: number | null
          contingency_percentage: number | null
          created_at: string | null
          custom_fields: Json | null
          declined_at: string | null
          declined_reason: string | null
          deleted_at: string | null
          description: string | null
          discount_amount: number | null
          discount_type: string | null
          discount_value: number | null
          equipment_cost: number | null
          estimate_number: string | null
          estimated_duration_days: number | null
          estimated_end_date: string | null
          estimated_start_date: string | null
          exclusions: string | null
          id: string
          internal_notes: string | null
          labor_cost: number | null
          lead_id: string | null
          material_cost: number | null
          metadata: Json | null
          overhead_amount: number | null
          parent_estimate_id: string | null
          payment_terms: string | null
          prepared_by: string | null
          profit_amount: number | null
          project_id: string | null
          property_id: string | null
          responded_at: string | null
          reviewed_by: string | null
          revision_number: number | null
          scope_of_work: string | null
          sent_at: string | null
          sent_via: string | null
          special_conditions: string | null
          status: Database["public"]["Enums"]["estimate_status"] | null
          subcontractor_cost: number | null
          subtotal: number | null
          tags: string[] | null
          tax_amount: number | null
          tax_rate: number | null
          tenant_id: string
          title: string | null
          total: number | null
          updated_at: string | null
          valid_until: string | null
          viewed_at: string | null
          warranty_terms: string | null
        }
        Insert: {
          accepted_at?: string | null
          ai_confidence_score?: number | null
          ai_generated?: boolean | null
          ai_model_key?: string | null
          ai_prompt?: string | null
          assumptions?: string | null
          client_id: string
          client_notes?: string | null
          contingency_amount?: number | null
          contingency_percentage?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          declined_at?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          equipment_cost?: number | null
          estimate_number?: string | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          exclusions?: string | null
          id?: string
          internal_notes?: string | null
          labor_cost?: number | null
          lead_id?: string | null
          material_cost?: number | null
          metadata?: Json | null
          overhead_amount?: number | null
          parent_estimate_id?: string | null
          payment_terms?: string | null
          prepared_by?: string | null
          profit_amount?: number | null
          project_id?: string | null
          property_id?: string | null
          responded_at?: string | null
          reviewed_by?: string | null
          revision_number?: number | null
          scope_of_work?: string | null
          sent_at?: string | null
          sent_via?: string | null
          special_conditions?: string | null
          status?: Database["public"]["Enums"]["estimate_status"] | null
          subcontractor_cost?: number | null
          subtotal?: number | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id: string
          title?: string | null
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
          viewed_at?: string | null
          warranty_terms?: string | null
        }
        Update: {
          accepted_at?: string | null
          ai_confidence_score?: number | null
          ai_generated?: boolean | null
          ai_model_key?: string | null
          ai_prompt?: string | null
          assumptions?: string | null
          client_id?: string
          client_notes?: string | null
          contingency_amount?: number | null
          contingency_percentage?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          declined_at?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          equipment_cost?: number | null
          estimate_number?: string | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          exclusions?: string | null
          id?: string
          internal_notes?: string | null
          labor_cost?: number | null
          lead_id?: string | null
          material_cost?: number | null
          metadata?: Json | null
          overhead_amount?: number | null
          parent_estimate_id?: string | null
          payment_terms?: string | null
          prepared_by?: string | null
          profit_amount?: number | null
          project_id?: string | null
          property_id?: string | null
          responded_at?: string | null
          reviewed_by?: string | null
          revision_number?: number | null
          scope_of_work?: string | null
          sent_at?: string | null
          sent_via?: string | null
          special_conditions?: string | null
          status?: Database["public"]["Enums"]["estimate_status"] | null
          subcontractor_cost?: number | null
          subtotal?: number | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id?: string
          title?: string | null
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
          viewed_at?: string | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_parent_estimate_id_fkey"
            columns: ["parent_estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "estimates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          account_code: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          deleted_at: string | null
          description: string
          expense_date: string
          id: string
          incurred_by: string | null
          is_billable: boolean | null
          is_reimbursable: boolean | null
          metadata: Json | null
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          project_id: string | null
          quickbooks_id: string | null
          receipt_number: string | null
          receipt_storage_path: string | null
          receipt_url: string | null
          status: Database["public"]["Enums"]["expense_status"] | null
          subcategory: string | null
          tags: string[] | null
          tax_amount: number | null
          tenant_id: string
          total_amount: number
          updated_at: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          account_code?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deleted_at?: string | null
          description: string
          expense_date?: string
          id?: string
          incurred_by?: string | null
          is_billable?: boolean | null
          is_reimbursable?: boolean | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: string | null
          quickbooks_id?: string | null
          receipt_number?: string | null
          receipt_storage_path?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          tax_amount?: number | null
          tenant_id: string
          total_amount: number
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          account_code?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deleted_at?: string | null
          description?: string
          expense_date?: string
          id?: string
          incurred_by?: string | null
          is_billable?: boolean | null
          is_reimbursable?: boolean | null
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: string | null
          quickbooks_id?: string | null
          receipt_number?: string | null
          receipt_storage_path?: string | null
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["expense_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          tax_amount?: number | null
          tenant_id?: string
          total_amount?: number
          updated_at?: string | null
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_incurred_by_fkey"
            columns: ["incurred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "expenses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_expenses_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          applies_to_plans: Database["public"]["Enums"]["tenant_plan"][] | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          rollout_percentage: number | null
          status: Database["public"]["Enums"]["feature_flag_status"] | null
          updated_at: string | null
        }
        Insert: {
          applies_to_plans?: Database["public"]["Enums"]["tenant_plan"][] | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          rollout_percentage?: number | null
          status?: Database["public"]["Enums"]["feature_flag_status"] | null
          updated_at?: string | null
        }
        Update: {
          applies_to_plans?: Database["public"]["Enums"]["tenant_plan"][] | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          rollout_percentage?: number | null
          status?: Database["public"]["Enums"]["feature_flag_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inspections: {
        Row: {
          actual_date: string | null
          correction_deadline: string | null
          corrections_required: string | null
          created_at: string | null
          id: string
          inspection_agency: string | null
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_email: string | null
          inspector_name: string | null
          inspector_phone: string | null
          metadata: Json | null
          notes: string | null
          permit_id: string | null
          photos: Json | null
          preparation_notes: string | null
          project_id: string
          reinspection_fee: number | null
          report_document_url: string | null
          result_notes: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: Database["public"]["Enums"]["inspection_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          actual_date?: string | null
          correction_deadline?: string | null
          corrections_required?: string | null
          created_at?: string | null
          id?: string
          inspection_agency?: string | null
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          inspector_email?: string | null
          inspector_name?: string | null
          inspector_phone?: string | null
          metadata?: Json | null
          notes?: string | null
          permit_id?: string | null
          photos?: Json | null
          preparation_notes?: string | null
          project_id: string
          reinspection_fee?: number | null
          report_document_url?: string | null
          result_notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          actual_date?: string | null
          correction_deadline?: string | null
          corrections_required?: string | null
          created_at?: string | null
          id?: string
          inspection_agency?: string | null
          inspection_type?: Database["public"]["Enums"]["inspection_type"]
          inspector_email?: string | null
          inspector_name?: string | null
          inspector_phone?: string | null
          metadata?: Json | null
          notes?: string | null
          permit_id?: string | null
          photos?: Json | null
          preparation_notes?: string | null
          project_id?: string
          reinspection_fee?: number | null
          report_document_url?: string | null
          result_notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["inspection_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_permit_id_fkey"
            columns: ["permit_id"]
            isOneToOne: false
            referencedRelation: "permits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "inspections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_connections: {
        Row: {
          access_token: string | null
          config: Json | null
          created_at: string | null
          error_count: number | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_sync_at: string | null
          metadata: Json | null
          provider: string
          refresh_token: string | null
          tenant_id: string
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider: string
          refresh_token?: string | null
          tenant_id: string
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          config?: Json | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider?: string
          refresh_token?: string | null
          tenant_id?: string
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "integration_connections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          first_name: string | null
          id: string
          invited_by: string | null
          last_name: string | null
          message: string | null
          metadata: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["invitation_status"] | null
          tenant_id: string
          token: string
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          message?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"] | null
          tenant_id: string
          token?: string
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          first_name?: string | null
          id?: string
          invited_by?: string | null
          last_name?: string | null
          message?: string | null
          metadata?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"] | null
          tenant_id?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string | null
          current_billed: number | null
          description: string | null
          estimate_line_item_id: string | null
          id: string
          invoice_id: string
          is_taxable: boolean | null
          item_type:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          line_order: number | null
          metadata: Json | null
          name: string
          notes: string | null
          phase_id: string | null
          previous_billed: number | null
          quantity: number | null
          retainage: number | null
          scheduled_value: number | null
          service_catalog_id: string | null
          stored_materials: number | null
          subtotal: number | null
          task_id: string | null
          tax_amount: number | null
          tax_rate: number | null
          tenant_id: string
          total: number | null
          total_completed: number | null
          unit: Database["public"]["Enums"]["material_unit"] | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_billed?: number | null
          description?: string | null
          estimate_line_item_id?: string | null
          id?: string
          invoice_id: string
          is_taxable?: boolean | null
          item_type?:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          line_order?: number | null
          metadata?: Json | null
          name: string
          notes?: string | null
          phase_id?: string | null
          previous_billed?: number | null
          quantity?: number | null
          retainage?: number | null
          scheduled_value?: number | null
          service_catalog_id?: string | null
          stored_materials?: number | null
          subtotal?: number | null
          task_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id: string
          total?: number | null
          total_completed?: number | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_billed?: number | null
          description?: string | null
          estimate_line_item_id?: string | null
          id?: string
          invoice_id?: string
          is_taxable?: boolean | null
          item_type?:
            | Database["public"]["Enums"]["estimate_line_item_type"]
            | null
          line_order?: number | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          phase_id?: string | null
          previous_billed?: number | null
          quantity?: number | null
          retainage?: number | null
          scheduled_value?: number | null
          service_catalog_id?: string | null
          stored_materials?: number | null
          subtotal?: number | null
          task_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id?: string
          total?: number | null
          total_completed?: number | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_estimate_line_item_id_fkey"
            columns: ["estimate_line_item_id"]
            isOneToOne: false
            referencedRelation: "estimate_line_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_service_catalog_id_fkey"
            columns: ["service_catalog_id"]
            isOneToOne: false
            referencedRelation: "service_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "invoice_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          approved_by: string | null
          balance_due: number | null
          change_order_id: string | null
          client_id: string
          completion_percentage: number | null
          contract_id: string | null
          created_at: string | null
          current_billing: number | null
          custom_fields: Json | null
          deleted_at: string | null
          discount_amount: number | null
          discount_type: string | null
          discount_value: number | null
          due_date: string | null
          estimate_id: string | null
          footer_text: string | null
          id: string
          internal_notes: string | null
          invoice_date: string
          invoice_number: string
          invoice_type: Database["public"]["Enums"]["invoice_type"] | null
          is_recurring: boolean | null
          last_reminder_sent_at: string | null
          late_fee_amount: number | null
          late_fee_applied: boolean | null
          metadata: Json | null
          next_invoice_date: string | null
          next_reminder_date: string | null
          notes: string | null
          paid_at: string | null
          payment_terms: string | null
          payment_terms_days: number | null
          period_end: string | null
          period_start: string | null
          prepared_by: string | null
          previous_billings: number | null
          project_id: string | null
          recurrence_pattern:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_end_date: string | null
          reminder_sent_count: number | null
          retainage_amount: number | null
          retainage_percentage: number | null
          retainage_released: number | null
          sent_at: string | null
          shipping_amount: number | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          stripe_hosted_url: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          subtotal: number | null
          tags: string[] | null
          tax_amount: number | null
          tax_rate: number | null
          tenant_id: string
          terms_text: string | null
          total: number | null
          updated_at: string | null
          viewed_at: string | null
          voided_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          approved_by?: string | null
          balance_due?: number | null
          change_order_id?: string | null
          client_id: string
          completion_percentage?: number | null
          contract_id?: string | null
          created_at?: string | null
          current_billing?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          due_date?: string | null
          estimate_id?: string | null
          footer_text?: string | null
          id?: string
          internal_notes?: string | null
          invoice_date?: string
          invoice_number: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"] | null
          is_recurring?: boolean | null
          last_reminder_sent_at?: string | null
          late_fee_amount?: number | null
          late_fee_applied?: boolean | null
          metadata?: Json | null
          next_invoice_date?: string | null
          next_reminder_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          period_end?: string | null
          period_start?: string | null
          prepared_by?: string | null
          previous_billings?: number | null
          project_id?: string | null
          recurrence_pattern?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_end_date?: string | null
          reminder_sent_count?: number | null
          retainage_amount?: number | null
          retainage_percentage?: number | null
          retainage_released?: number | null
          sent_at?: string | null
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_hosted_url?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id: string
          terms_text?: string | null
          total?: number | null
          updated_at?: string | null
          viewed_at?: string | null
          voided_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          approved_by?: string | null
          balance_due?: number | null
          change_order_id?: string | null
          client_id?: string
          completion_percentage?: number | null
          contract_id?: string | null
          created_at?: string | null
          current_billing?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          due_date?: string | null
          estimate_id?: string | null
          footer_text?: string | null
          id?: string
          internal_notes?: string | null
          invoice_date?: string
          invoice_number?: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"] | null
          is_recurring?: boolean | null
          last_reminder_sent_at?: string | null
          late_fee_amount?: number | null
          late_fee_applied?: boolean | null
          metadata?: Json | null
          next_invoice_date?: string | null
          next_reminder_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          period_end?: string | null
          period_start?: string | null
          prepared_by?: string | null
          previous_billings?: number | null
          project_id?: string | null
          recurrence_pattern?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_end_date?: string | null
          reminder_sent_count?: number | null
          retainage_amount?: number | null
          retainage_percentage?: number | null
          retainage_released?: number | null
          sent_at?: string | null
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_hosted_url?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal?: number | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id?: string
          terms_text?: string | null
          total?: number | null
          updated_at?: string | null
          viewed_at?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_change_order_id_fkey"
            columns: ["change_order_id"]
            isOneToOne: false
            referencedRelation: "change_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          ai_estimated_duration_days: number | null
          ai_estimated_value: number | null
          ai_recommended_services: string[] | null
          ai_summary: string | null
          assigned_at: string | null
          assigned_to: string | null
          budget_flexibility: string | null
          budget_range_high: number | null
          budget_range_low: number | null
          chat_transcript: Json | null
          city: string | null
          company_name: string | null
          conversion_value: number | null
          converted_at: string | null
          converted_to_client_id: string | null
          converted_to_project_id: string | null
          county: string | null
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          desired_completion_date: string | null
          desired_start_date: string | null
          email: string | null
          first_name: string | null
          first_response_at: string | null
          flexibility: string | null
          follow_up_count: number | null
          id: string
          internal_notes: string | null
          landing_page: string | null
          last_contact_at: string | null
          last_name: string | null
          latitude: number | null
          longitude: number | null
          lost_at: string | null
          lost_feedback: string | null
          lost_reason: string | null
          lost_to_competitor: string | null
          metadata: Json | null
          next_follow_up_at: string | null
          phone: string | null
          phone_secondary: string | null
          photos: Json | null
          preferred_contact:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          preview_token: string | null
          priority: Database["public"]["Enums"]["lead_priority"] | null
          project_description: string | null
          project_details: Json | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          referrer_url: string | null
          response_time_minutes: number | null
          score: number | null
          score_factors: Json | null
          solution_schedule: Json | null
          source: Database["public"]["Enums"]["lead_source"] | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          tags: string[] | null
          temperature: Database["public"]["Enums"]["lead_temperature"] | null
          tenant_id: string
          trade_category: Database["public"]["Enums"]["trade_category"] | null
          updated_at: string | null
          uploaded_files: Json | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          ai_estimated_duration_days?: number | null
          ai_estimated_value?: number | null
          ai_recommended_services?: string[] | null
          ai_summary?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          budget_flexibility?: string | null
          budget_range_high?: number | null
          budget_range_low?: number | null
          chat_transcript?: Json | null
          city?: string | null
          company_name?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          converted_to_client_id?: string | null
          converted_to_project_id?: string | null
          county?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          desired_completion_date?: string | null
          desired_start_date?: string | null
          email?: string | null
          first_name?: string | null
          first_response_at?: string | null
          flexibility?: string | null
          follow_up_count?: number | null
          id?: string
          internal_notes?: string | null
          landing_page?: string | null
          last_contact_at?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          lost_at?: string | null
          lost_feedback?: string | null
          lost_reason?: string | null
          lost_to_competitor?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          phone?: string | null
          phone_secondary?: string | null
          photos?: Json | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          preview_token?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          project_description?: string | null
          project_details?: Json | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          referrer_url?: string | null
          response_time_minutes?: number | null
          score?: number | null
          score_factors?: Json | null
          solution_schedule?: Json | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          tenant_id: string
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          updated_at?: string | null
          uploaded_files?: Json | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          ai_estimated_duration_days?: number | null
          ai_estimated_value?: number | null
          ai_recommended_services?: string[] | null
          ai_summary?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          budget_flexibility?: string | null
          budget_range_high?: number | null
          budget_range_low?: number | null
          chat_transcript?: Json | null
          city?: string | null
          company_name?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          converted_to_client_id?: string | null
          converted_to_project_id?: string | null
          county?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          desired_completion_date?: string | null
          desired_start_date?: string | null
          email?: string | null
          first_name?: string | null
          first_response_at?: string | null
          flexibility?: string | null
          follow_up_count?: number | null
          id?: string
          internal_notes?: string | null
          landing_page?: string | null
          last_contact_at?: string | null
          last_name?: string | null
          latitude?: number | null
          longitude?: number | null
          lost_at?: string | null
          lost_feedback?: string | null
          lost_reason?: string | null
          lost_to_competitor?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          phone?: string | null
          phone_secondary?: string | null
          photos?: Json | null
          preferred_contact?:
            | Database["public"]["Enums"]["contact_method_preference"]
            | null
          preview_token?: string | null
          priority?: Database["public"]["Enums"]["lead_priority"] | null
          project_description?: string | null
          project_details?: Json | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          referrer_url?: string | null
          response_time_minutes?: number | null
          score?: number | null
          score_factors?: Json | null
          solution_schedule?: Json | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          tenant_id?: string
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          updated_at?: string | null
          uploaded_files?: Json | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_leads_project"
            columns: ["converted_to_project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_leads_project"
            columns: ["converted_to_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_to_client_id_fkey"
            columns: ["converted_to_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "leads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      lien_waivers: {
        Row: {
          amount_of_exception: number | null
          amount_of_payment: number | null
          claimant_address: string | null
          claimant_name: string
          claimant_type: string | null
          contract_id: string | null
          created_at: string | null
          document_storage_path: string | null
          document_url: string | null
          exception_description: string | null
          id: string
          metadata: Json | null
          notarized: boolean | null
          notarized_at: string | null
          notes: string | null
          project_id: string
          property_description: string | null
          property_owner: string | null
          signed_at: string | null
          signed_by: string | null
          status: Database["public"]["Enums"]["lien_waiver_status"] | null
          tenant_id: string
          through_date: string | null
          updated_at: string | null
          waiver_type: Database["public"]["Enums"]["lien_waiver_type"]
        }
        Insert: {
          amount_of_exception?: number | null
          amount_of_payment?: number | null
          claimant_address?: string | null
          claimant_name: string
          claimant_type?: string | null
          contract_id?: string | null
          created_at?: string | null
          document_storage_path?: string | null
          document_url?: string | null
          exception_description?: string | null
          id?: string
          metadata?: Json | null
          notarized?: boolean | null
          notarized_at?: string | null
          notes?: string | null
          project_id: string
          property_description?: string | null
          property_owner?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["lien_waiver_status"] | null
          tenant_id: string
          through_date?: string | null
          updated_at?: string | null
          waiver_type: Database["public"]["Enums"]["lien_waiver_type"]
        }
        Update: {
          amount_of_exception?: number | null
          amount_of_payment?: number | null
          claimant_address?: string | null
          claimant_name?: string
          claimant_type?: string | null
          contract_id?: string | null
          created_at?: string | null
          document_storage_path?: string | null
          document_url?: string | null
          exception_description?: string | null
          id?: string
          metadata?: Json | null
          notarized?: boolean | null
          notarized_at?: string | null
          notes?: string | null
          project_id?: string
          property_description?: string | null
          property_owner?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["lien_waiver_status"] | null
          tenant_id?: string
          through_date?: string | null
          updated_at?: string | null
          waiver_type?: Database["public"]["Enums"]["lien_waiver_type"]
        }
        Relationships: [
          {
            foreignKeyName: "lien_waivers_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lien_waivers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "lien_waivers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lien_waivers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "lien_waivers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_log: {
        Row: {
          created_at: string | null
          description: string
          equipment_id: string | null
          hours_at_service: number | null
          id: string
          labor_cost: number | null
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          metadata: Json | null
          mileage_at_service: number | null
          next_service_date: string | null
          notes: string | null
          parts_cost: number | null
          performed_by: string | null
          receipt_url: string | null
          service_date: string
          tenant_id: string
          total_cost: number | null
          updated_at: string | null
          vehicle_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          equipment_id?: string | null
          hours_at_service?: number | null
          id?: string
          labor_cost?: number | null
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          metadata?: Json | null
          mileage_at_service?: number | null
          next_service_date?: string | null
          notes?: string | null
          parts_cost?: number | null
          performed_by?: string | null
          receipt_url?: string | null
          service_date: string
          tenant_id: string
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          equipment_id?: string | null
          hours_at_service?: number | null
          id?: string
          labor_cost?: number | null
          maintenance_type?: Database["public"]["Enums"]["maintenance_type"]
          metadata?: Json | null
          mileage_at_service?: number | null
          next_service_date?: string | null
          notes?: string | null
          parts_cost?: number | null
          performed_by?: string | null
          receipt_url?: string | null
          service_date?: string
          tenant_id?: string
          total_cost?: number | null
          updated_at?: string | null
          vehicle_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_log_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "maintenance_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_log_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      material_library: {
        Row: {
          brand: string | null
          category: string | null
          color: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          dimensions: Json | null
          finish: string | null
          id: string
          image_url: string | null
          images: Json | null
          inventory_status:
            | Database["public"]["Enums"]["inventory_status"]
            | null
          is_active: boolean | null
          is_taxable: boolean | null
          last_price_update: string | null
          lead_time_days: number | null
          manufacturer: string | null
          markup_percentage: number | null
          metadata: Json | null
          minimum_order_quantity: number | null
          model_number: string | null
          name: string
          notes: string | null
          preferred_supplier_id: string | null
          price_history: Json | null
          quantity_on_hand: number | null
          quantity_on_order: number | null
          quantity_reserved: number | null
          reorder_point: number | null
          reorder_quantity: number | null
          retail_price: number | null
          sku: string | null
          spec_sheet_url: string | null
          specifications: Json | null
          storage_location: string | null
          subcategory: string | null
          supplier_name: string | null
          supplier_part_number: string | null
          supplier_url: string | null
          tags: string[] | null
          tenant_id: string
          track_inventory: boolean | null
          trade_category: Database["public"]["Enums"]["trade_category"] | null
          unit: Database["public"]["Enums"]["material_unit"] | null
          unit_cost: number | null
          updated_at: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json | null
          finish?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          inventory_status?:
            | Database["public"]["Enums"]["inventory_status"]
            | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          last_price_update?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percentage?: number | null
          metadata?: Json | null
          minimum_order_quantity?: number | null
          model_number?: string | null
          name: string
          notes?: string | null
          preferred_supplier_id?: string | null
          price_history?: Json | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          sku?: string | null
          spec_sheet_url?: string | null
          specifications?: Json | null
          storage_location?: string | null
          subcategory?: string | null
          supplier_name?: string | null
          supplier_part_number?: string | null
          supplier_url?: string | null
          tags?: string[] | null
          tenant_id: string
          track_inventory?: boolean | null
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_cost?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json | null
          finish?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          inventory_status?:
            | Database["public"]["Enums"]["inventory_status"]
            | null
          is_active?: boolean | null
          is_taxable?: boolean | null
          last_price_update?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          markup_percentage?: number | null
          metadata?: Json | null
          minimum_order_quantity?: number | null
          model_number?: string | null
          name?: string
          notes?: string | null
          preferred_supplier_id?: string | null
          price_history?: Json | null
          quantity_on_hand?: number | null
          quantity_on_order?: number | null
          quantity_reserved?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
          retail_price?: number | null
          sku?: string | null
          spec_sheet_url?: string | null
          specifications?: Json | null
          storage_location?: string | null
          subcategory?: string | null
          supplier_name?: string | null
          supplier_part_number?: string | null
          supplier_url?: string | null
          tags?: string[] | null
          tenant_id?: string
          track_inventory?: boolean | null
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_cost?: number | null
          updated_at?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_materials_vendor"
            columns: ["preferred_supplier_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_library_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "material_library_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_open: boolean | null
          last_message_at: string | null
          last_message_preview: string | null
          lead_id: string | null
          message_count: number | null
          metadata: Json | null
          participant_ids: string[] | null
          project_id: string | null
          subject: string | null
          tenant_id: string
          thread_type: string | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_open?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          lead_id?: string | null
          message_count?: number | null
          metadata?: Json | null
          participant_ids?: string[] | null
          project_id?: string | null
          subject?: string | null
          tenant_id: string
          thread_type?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_open?: boolean | null
          last_message_at?: string | null
          last_message_preview?: string | null
          lead_id?: string | null
          message_count?: number | null
          metadata?: Json | null
          participant_ids?: string[] | null
          project_id?: string | null
          subject?: string | null
          tenant_id?: string
          thread_type?: string | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "message_threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "message_threads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          ai_generated: boolean | null
          ai_model_key: string | null
          attachments: Json | null
          body: string
          body_html: string | null
          channel: Database["public"]["Enums"]["message_channel"] | null
          created_at: string | null
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction"] | null
          email_bcc: string[] | null
          email_cc: string[] | null
          email_from: string | null
          email_to: string[] | null
          external_message_id: string | null
          id: string
          in_reply_to: string | null
          metadata: Json | null
          read_at: string | null
          read_by: string[] | null
          sender_id: string | null
          sender_type: string | null
          sent_at: string | null
          sms_from: string | null
          sms_segments: number | null
          sms_to: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string | null
          tenant_id: string
          thread_id: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_model_key?: string | null
          attachments?: Json | null
          body: string
          body_html?: string | null
          channel?: Database["public"]["Enums"]["message_channel"] | null
          created_at?: string | null
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"] | null
          email_bcc?: string[] | null
          email_cc?: string[] | null
          email_from?: string | null
          email_to?: string[] | null
          external_message_id?: string | null
          id?: string
          in_reply_to?: string | null
          metadata?: Json | null
          read_at?: string | null
          read_by?: string[] | null
          sender_id?: string | null
          sender_type?: string | null
          sent_at?: string | null
          sms_from?: string | null
          sms_segments?: number | null
          sms_to?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string | null
          tenant_id: string
          thread_id: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_model_key?: string | null
          attachments?: Json | null
          body?: string
          body_html?: string | null
          channel?: Database["public"]["Enums"]["message_channel"] | null
          created_at?: string | null
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"] | null
          email_bcc?: string[] | null
          email_cc?: string[] | null
          email_from?: string | null
          email_to?: string[] | null
          external_message_id?: string | null
          id?: string
          in_reply_to?: string | null
          metadata?: Json | null
          read_at?: string | null
          read_by?: string[] | null
          sender_id?: string | null
          sender_type?: string | null
          sent_at?: string | null
          sms_from?: string | null
          sms_segments?: number | null
          sms_to?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string | null
          tenant_id?: string
          thread_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          body: string | null
          channels_sent: Database["public"]["Enums"]["message_channel"][] | null
          created_at: string | null
          dismissed_at: string | null
          email_sent: boolean | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          metadata: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority: Database["public"]["Enums"]["notification_priority"] | null
          push_sent: boolean | null
          read_at: string | null
          sms_sent: boolean | null
          tenant_id: string
          title: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          body?: string | null
          channels_sent?:
            | Database["public"]["Enums"]["message_channel"][]
            | null
          created_at?: string | null
          dismissed_at?: string | null
          email_sent?: boolean | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          push_sent?: boolean | null
          read_at?: string | null
          sms_sent?: boolean | null
          tenant_id: string
          title: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          body?: string | null
          channels_sent?:
            | Database["public"]["Enums"]["message_channel"][]
            | null
          created_at?: string | null
          dismissed_at?: string | null
          email_sent?: boolean | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          push_sent?: boolean | null
          read_at?: string | null
          sms_sent?: boolean | null
          tenant_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          ach_account_last_four: string | null
          ach_bank_name: string | null
          ach_routing_last_four: string | null
          amount: number
          applied_to_invoices: Json | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last_four: string | null
          check_bank: string | null
          check_image_url: string | null
          check_number: string | null
          cleared_date: string | null
          client_id: string
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          deposited_date: string | null
          id: string
          internal_notes: string | null
          invoice_id: string | null
          is_refund: boolean | null
          memo: string | null
          metadata: Json | null
          original_payment_id: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string | null
          project_id: string | null
          received_date: string | null
          recorded_by: string | null
          reference_number: string | null
          refund_amount: number | null
          refund_reason: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id: string | null
          stripe_fee: number | null
          stripe_net: number | null
          stripe_payment_intent_id: string | null
          stripe_payout_id: string | null
          stripe_receipt_url: string | null
          stripe_refund_id: string | null
          stripe_transfer_id: string | null
          tenant_id: string
          unapplied_amount: number | null
          updated_at: string | null
        }
        Insert: {
          ach_account_last_four?: string | null
          ach_bank_name?: string | null
          ach_routing_last_four?: string | null
          amount: number
          applied_to_invoices?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          check_bank?: string | null
          check_image_url?: string | null
          check_number?: string | null
          cleared_date?: string | null
          client_id: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deposited_date?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          is_refund?: boolean | null
          memo?: string | null
          metadata?: Json | null
          original_payment_id?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          project_id?: string | null
          received_date?: string | null
          recorded_by?: string | null
          reference_number?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id?: string | null
          stripe_fee?: number | null
          stripe_net?: number | null
          stripe_payment_intent_id?: string | null
          stripe_payout_id?: string | null
          stripe_receipt_url?: string | null
          stripe_refund_id?: string | null
          stripe_transfer_id?: string | null
          tenant_id: string
          unapplied_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          ach_account_last_four?: string | null
          ach_bank_name?: string | null
          ach_routing_last_four?: string | null
          amount?: number
          applied_to_invoices?: Json | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last_four?: string | null
          check_bank?: string | null
          check_image_url?: string | null
          check_number?: string | null
          cleared_date?: string | null
          client_id?: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          deposited_date?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          is_refund?: boolean | null
          memo?: string | null
          metadata?: Json | null
          original_payment_id?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          project_id?: string | null
          received_date?: string | null
          recorded_by?: string | null
          reference_number?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id?: string | null
          stripe_fee?: number | null
          stripe_net?: number | null
          stripe_payment_intent_id?: string | null
          stripe_payout_id?: string | null
          stripe_receipt_url?: string | null
          stripe_refund_id?: string | null
          stripe_transfer_id?: string | null
          tenant_id?: string
          unapplied_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_original_payment_id_fkey"
            columns: ["original_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      permits: {
        Row: {
          application_date: string | null
          application_document_url: string | null
          application_fee: number | null
          approval_date: string | null
          authority_email: string | null
          authority_phone: string | null
          authority_website: string | null
          conditions: string | null
          created_at: string | null
          expiration_date: string | null
          final_date: string | null
          id: string
          issued_date: string | null
          issuing_authority: string | null
          jurisdiction: string | null
          jurisdiction_type: string | null
          metadata: Json | null
          notes: string | null
          permit_document_url: string | null
          permit_fee: number | null
          permit_number: string | null
          permit_type: Database["public"]["Enums"]["permit_type"]
          project_id: string
          requirements: string | null
          special_inspections_required: string[] | null
          status: Database["public"]["Enums"]["permit_status"] | null
          tenant_id: string
          total_fees: number | null
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          application_document_url?: string | null
          application_fee?: number | null
          approval_date?: string | null
          authority_email?: string | null
          authority_phone?: string | null
          authority_website?: string | null
          conditions?: string | null
          created_at?: string | null
          expiration_date?: string | null
          final_date?: string | null
          id?: string
          issued_date?: string | null
          issuing_authority?: string | null
          jurisdiction?: string | null
          jurisdiction_type?: string | null
          metadata?: Json | null
          notes?: string | null
          permit_document_url?: string | null
          permit_fee?: number | null
          permit_number?: string | null
          permit_type: Database["public"]["Enums"]["permit_type"]
          project_id: string
          requirements?: string | null
          special_inspections_required?: string[] | null
          status?: Database["public"]["Enums"]["permit_status"] | null
          tenant_id: string
          total_fees?: number | null
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          application_document_url?: string | null
          application_fee?: number | null
          approval_date?: string | null
          authority_email?: string | null
          authority_phone?: string | null
          authority_website?: string | null
          conditions?: string | null
          created_at?: string | null
          expiration_date?: string | null
          final_date?: string | null
          id?: string
          issued_date?: string | null
          issuing_authority?: string | null
          jurisdiction?: string | null
          jurisdiction_type?: string | null
          metadata?: Json | null
          notes?: string | null
          permit_document_url?: string | null
          permit_fee?: number | null
          permit_number?: string | null
          permit_type?: Database["public"]["Enums"]["permit_type"]
          project_id?: string
          requirements?: string | null
          special_inspections_required?: string[] | null
          status?: Database["public"]["Enums"]["permit_status"] | null
          tenant_id?: string
          total_fees?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "permits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permits_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "permits_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          after_images: Json | null
          before_images: Json | null
          created_at: string | null
          featured_image_url: string | null
          full_description: string | null
          gallery_images: Json | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          location_city: string | null
          location_state: string | null
          meta_description: string | null
          meta_title: string | null
          metadata: Json | null
          project_cost_range: string | null
          project_duration_text: string | null
          project_id: string | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          service_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          short_description: string | null
          slug: string | null
          sort_order: number | null
          square_footage: number | null
          tags: string[] | null
          tenant_id: string
          testimonial_author: string | null
          testimonial_rating: number | null
          testimonial_text: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          year_completed: number | null
        }
        Insert: {
          after_images?: Json | null
          before_images?: Json | null
          created_at?: string | null
          featured_image_url?: string | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location_city?: string | null
          location_state?: string | null
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          project_cost_range?: string | null
          project_duration_text?: string | null
          project_id?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          service_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          square_footage?: number | null
          tags?: string[] | null
          tenant_id: string
          testimonial_author?: string | null
          testimonial_rating?: number | null
          testimonial_text?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          year_completed?: number | null
        }
        Update: {
          after_images?: Json | null
          before_images?: Json | null
          created_at?: string | null
          featured_image_url?: string | null
          full_description?: string | null
          gallery_images?: Json | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          location_city?: string | null
          location_state?: string | null
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          project_cost_range?: string | null
          project_duration_text?: string | null
          project_id?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          service_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          short_description?: string | null
          slug?: string | null
          sort_order?: number | null
          square_footage?: number | null
          tags?: string[] | null
          tenant_id?: string
          testimonial_author?: string | null
          testimonial_rating?: number | null
          testimonial_text?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          year_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "portfolio_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "portfolio_projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          actual_start_date: string | null
          assigned_to: string | null
          budget_percentage: number | null
          client_description: string | null
          completion_percentage: number | null
          created_at: string | null
          depends_on_phase_id: string | null
          description: string | null
          estimated_cost: number | null
          estimated_duration_days: number | null
          estimated_end_date: string | null
          estimated_start_date: string | null
          id: string
          metadata: Json | null
          name: string
          notes: string | null
          phase_order: number
          project_id: string
          status: Database["public"]["Enums"]["project_phase_status"] | null
          tenant_id: string
          updated_at: string | null
          visible_to_client: boolean | null
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          assigned_to?: string | null
          budget_percentage?: number | null
          client_description?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          depends_on_phase_id?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          notes?: string | null
          phase_order?: number
          project_id: string
          status?: Database["public"]["Enums"]["project_phase_status"] | null
          tenant_id: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          assigned_to?: string | null
          budget_percentage?: number | null
          client_description?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          depends_on_phase_id?: string | null
          description?: string | null
          estimated_cost?: number | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          notes?: string | null
          phase_order?: number
          project_id?: string
          status?: Database["public"]["Enums"]["project_phase_status"] | null
          tenant_id?: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_depends_on_phase_id_fkey"
            columns: ["depends_on_phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_phases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "project_phases_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_photos: {
        Row: {
          ai_analysis: Json | null
          ai_description: string | null
          ai_tags: string[] | null
          caption: string | null
          category: string | null
          created_at: string | null
          daily_log_id: string | null
          description: string | null
          file_name: string | null
          file_size_bytes: number | null
          height: number | null
          id: string
          is_featured: boolean | null
          is_portfolio: boolean | null
          latitude: number | null
          location_description: string | null
          longitude: number | null
          metadata: Json | null
          mime_type: string | null
          phase_id: string | null
          project_id: string
          sort_order: number | null
          storage_path: string
          tags: string[] | null
          taken_at: string | null
          task_id: string | null
          tenant_id: string
          thumbnail_path: string | null
          updated_at: string | null
          uploaded_by: string | null
          visible_to_client: boolean | null
          width: number | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_description?: string | null
          ai_tags?: string[] | null
          caption?: string | null
          category?: string | null
          created_at?: string | null
          daily_log_id?: string | null
          description?: string | null
          file_name?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_featured?: boolean | null
          is_portfolio?: boolean | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          metadata?: Json | null
          mime_type?: string | null
          phase_id?: string | null
          project_id: string
          sort_order?: number | null
          storage_path: string
          tags?: string[] | null
          taken_at?: string | null
          task_id?: string | null
          tenant_id: string
          thumbnail_path?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean | null
          width?: number | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_description?: string | null
          ai_tags?: string[] | null
          caption?: string | null
          category?: string | null
          created_at?: string | null
          daily_log_id?: string | null
          description?: string | null
          file_name?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_featured?: boolean | null
          is_portfolio?: boolean | null
          latitude?: number | null
          location_description?: string | null
          longitude?: number | null
          metadata?: Json | null
          mime_type?: string | null
          phase_id?: string | null
          project_id?: string
          sort_order?: number | null
          storage_path?: string
          tags?: string[] | null
          taken_at?: string | null
          task_id?: string | null
          tenant_id?: string
          thumbnail_path?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_photos_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "project_photos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          actual_hours: number | null
          actual_start_date: string | null
          assigned_crew_id: string | null
          assigned_to: string | null
          billable: boolean | null
          checklist: Json | null
          client_completed_at: string | null
          completed_at: string | null
          completed_by: string | null
          completion_percentage: number | null
          contractor_completed_at: string | null
          created_at: string | null
          created_by_client: boolean | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          estimated_end_date: string | null
          estimated_hours: number | null
          estimated_start_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          parent_task_id: string | null
          phase_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          task_order: number | null
          tenant_id: string
          title: string
          updated_at: string | null
          visible_to_client: boolean | null
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          assigned_crew_id?: string | null
          assigned_to?: string | null
          billable?: boolean | null
          checklist?: Json | null
          client_completed_at?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_percentage?: number | null
          contractor_completed_at?: string | null
          created_at?: string | null
          created_by_client?: boolean | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          estimated_end_date?: string | null
          estimated_hours?: number | null
          estimated_start_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          parent_task_id?: string | null
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id: string
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          task_order?: number | null
          tenant_id: string
          title: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_hours?: number | null
          actual_start_date?: string | null
          assigned_crew_id?: string | null
          assigned_to?: string | null
          billable?: boolean | null
          checklist?: Json | null
          client_completed_at?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_percentage?: number | null
          contractor_completed_at?: string | null
          created_at?: string | null
          created_by_client?: boolean | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          estimated_end_date?: string | null
          estimated_hours?: number | null
          estimated_start_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          parent_task_id?: string | null
          phase_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          task_order?: number | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_crew"
            columns: ["assigned_crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "project_tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_cost: number | null
          actual_duration_days: number | null
          actual_end_date: string | null
          actual_start_date: string | null
          ai_material_list: Json | null
          ai_recommended_phases: Json | null
          ai_risk_assessment: string | null
          ai_scope_summary: string | null
          all_permits_approved: boolean | null
          change_order_total: number | null
          client_id: string
          client_visible_notes: string | null
          completion_percentage: number | null
          complexity: Database["public"]["Enums"]["project_complexity"] | null
          contract_amount: number | null
          created_at: string | null
          custom_fields: Json | null
          deductible_amount: number | null
          deleted_at: string | null
          description: string | null
          discount_amount: number | null
          discount_reason: string | null
          estimated_cost: number | null
          estimated_duration_days: number | null
          estimated_end_date: string | null
          estimated_start_date: string | null
          estimator_id: string | null
          foreman_id: string | null
          id: string
          insurance_adjuster_email: string | null
          insurance_adjuster_name: string | null
          insurance_adjuster_phone: string | null
          insurance_claim: boolean | null
          insurance_claim_number: string | null
          insurance_company: string | null
          internal_notes: string | null
          job_site_access_notes: string | null
          job_site_address: string | null
          job_site_city: string | null
          job_site_gate_code: string | null
          job_site_latitude: number | null
          job_site_longitude: number | null
          job_site_state: string | null
          job_site_zip: string | null
          lead_id: string | null
          markup_percentage: number | null
          metadata: Json | null
          name: string
          permits_required: boolean | null
          primary_contract_id: string | null
          primary_estimate_id: string | null
          primary_proposal_id: string | null
          priority: Database["public"]["Enums"]["project_priority"] | null
          profit_margin_percentage: number | null
          project_manager_id: string | null
          project_number: string | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          property_id: string | null
          punch_list_items_completed: number | null
          punch_list_items_total: number | null
          retainage_held: number | null
          revised_contract_amount: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          tags: string[] | null
          tax_amount: number | null
          tax_rate: number | null
          tenant_id: string
          total_invoiced: number | null
          total_outstanding: number | null
          total_paid: number | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
          warranty_duration_days: number | null
          warranty_end_date: string | null
          warranty_start_date: string | null
          warranty_terms: string | null
          warranty_type: Database["public"]["Enums"]["warranty_type"] | null
        }
        Insert: {
          actual_cost?: number | null
          actual_duration_days?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          ai_material_list?: Json | null
          ai_recommended_phases?: Json | null
          ai_risk_assessment?: string | null
          ai_scope_summary?: string | null
          all_permits_approved?: boolean | null
          change_order_total?: number | null
          client_id: string
          client_visible_notes?: string | null
          completion_percentage?: number | null
          complexity?: Database["public"]["Enums"]["project_complexity"] | null
          contract_amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          deductible_amount?: number | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          estimated_cost?: number | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          estimator_id?: string | null
          foreman_id?: string | null
          id?: string
          insurance_adjuster_email?: string | null
          insurance_adjuster_name?: string | null
          insurance_adjuster_phone?: string | null
          insurance_claim?: boolean | null
          insurance_claim_number?: string | null
          insurance_company?: string | null
          internal_notes?: string | null
          job_site_access_notes?: string | null
          job_site_address?: string | null
          job_site_city?: string | null
          job_site_gate_code?: string | null
          job_site_latitude?: number | null
          job_site_longitude?: number | null
          job_site_state?: string | null
          job_site_zip?: string | null
          lead_id?: string | null
          markup_percentage?: number | null
          metadata?: Json | null
          name: string
          permits_required?: boolean | null
          primary_contract_id?: string | null
          primary_estimate_id?: string | null
          primary_proposal_id?: string | null
          priority?: Database["public"]["Enums"]["project_priority"] | null
          profit_margin_percentage?: number | null
          project_manager_id?: string | null
          project_number?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          property_id?: string | null
          punch_list_items_completed?: number | null
          punch_list_items_total?: number | null
          retainage_held?: number | null
          revised_contract_amount?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id: string
          total_invoiced?: number | null
          total_outstanding?: number | null
          total_paid?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          warranty_duration_days?: number | null
          warranty_end_date?: string | null
          warranty_start_date?: string | null
          warranty_terms?: string | null
          warranty_type?: Database["public"]["Enums"]["warranty_type"] | null
        }
        Update: {
          actual_cost?: number | null
          actual_duration_days?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          ai_material_list?: Json | null
          ai_recommended_phases?: Json | null
          ai_risk_assessment?: string | null
          ai_scope_summary?: string | null
          all_permits_approved?: boolean | null
          change_order_total?: number | null
          client_id?: string
          client_visible_notes?: string | null
          completion_percentage?: number | null
          complexity?: Database["public"]["Enums"]["project_complexity"] | null
          contract_amount?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          deductible_amount?: number | null
          deleted_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_reason?: string | null
          estimated_cost?: number | null
          estimated_duration_days?: number | null
          estimated_end_date?: string | null
          estimated_start_date?: string | null
          estimator_id?: string | null
          foreman_id?: string | null
          id?: string
          insurance_adjuster_email?: string | null
          insurance_adjuster_name?: string | null
          insurance_adjuster_phone?: string | null
          insurance_claim?: boolean | null
          insurance_claim_number?: string | null
          insurance_company?: string | null
          internal_notes?: string | null
          job_site_access_notes?: string | null
          job_site_address?: string | null
          job_site_city?: string | null
          job_site_gate_code?: string | null
          job_site_latitude?: number | null
          job_site_longitude?: number | null
          job_site_state?: string | null
          job_site_zip?: string | null
          lead_id?: string | null
          markup_percentage?: number | null
          metadata?: Json | null
          name?: string
          permits_required?: boolean | null
          primary_contract_id?: string | null
          primary_estimate_id?: string | null
          primary_proposal_id?: string | null
          priority?: Database["public"]["Enums"]["project_priority"] | null
          profit_margin_percentage?: number | null
          project_manager_id?: string | null
          project_number?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          property_id?: string | null
          punch_list_items_completed?: number | null
          punch_list_items_total?: number | null
          retainage_held?: number | null
          revised_contract_amount?: number | null
          status?: Database["public"]["Enums"]["project_status"] | null
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          tenant_id?: string
          total_invoiced?: number | null
          total_outstanding?: number | null
          total_paid?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          warranty_duration_days?: number | null
          warranty_end_date?: string | null
          warranty_start_date?: string | null
          warranty_terms?: string | null
          warranty_type?: Database["public"]["Enums"]["warranty_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_contract"
            columns: ["primary_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_projects_estimate"
            columns: ["primary_estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_projects_proposal"
            columns: ["primary_proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_estimator_id_fkey"
            columns: ["estimator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_foreman_id_fkey"
            columns: ["foreman_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_manager_id_fkey"
            columns: ["project_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          access_notes: string | null
          address_line1: string
          address_line2: string | null
          alarm_code: string | null
          alarm_company: string | null
          basement_type: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          client_id: string
          cooling_type: string | null
          country: string | null
          county: string | null
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          electrical_service: string | null
          garage_spaces: number | null
          gate_code: string | null
          heating_type: string | null
          hoa_approval_required: boolean | null
          hoa_contact: string | null
          hoa_email: string | null
          hoa_name: string | null
          hoa_phone: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          lockbox_code: string | null
          longitude: number | null
          lot_size_acres: number | null
          lot_size_sqft: number | null
          metadata: Json | null
          name: string | null
          notes: string | null
          parking_instructions: string | null
          pet_info: string | null
          photos: Json | null
          property_age_range:
            | Database["public"]["Enums"]["property_age_range"]
            | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          roof_age_years: number | null
          roof_type: string | null
          sewer_type: string | null
          siding_type: string | null
          special_conditions: string | null
          square_footage: number | null
          state: string
          stories: number | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
          water_source: string | null
          year_built: number | null
          zip_code: string
        }
        Insert: {
          access_notes?: string | null
          address_line1: string
          address_line2?: string | null
          alarm_code?: string | null
          alarm_company?: string | null
          basement_type?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          client_id: string
          cooling_type?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          electrical_service?: string | null
          garage_spaces?: number | null
          gate_code?: string | null
          heating_type?: string | null
          hoa_approval_required?: boolean | null
          hoa_contact?: string | null
          hoa_email?: string | null
          hoa_name?: string | null
          hoa_phone?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          lockbox_code?: string | null
          longitude?: number | null
          lot_size_acres?: number | null
          lot_size_sqft?: number | null
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          parking_instructions?: string | null
          pet_info?: string | null
          photos?: Json | null
          property_age_range?:
            | Database["public"]["Enums"]["property_age_range"]
            | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          roof_age_years?: number | null
          roof_type?: string | null
          sewer_type?: string | null
          siding_type?: string | null
          special_conditions?: string | null
          square_footage?: number | null
          state: string
          stories?: number | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
          water_source?: string | null
          year_built?: number | null
          zip_code: string
        }
        Update: {
          access_notes?: string | null
          address_line1?: string
          address_line2?: string | null
          alarm_code?: string | null
          alarm_company?: string | null
          basement_type?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          client_id?: string
          cooling_type?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          electrical_service?: string | null
          garage_spaces?: number | null
          gate_code?: string | null
          heating_type?: string | null
          hoa_approval_required?: boolean | null
          hoa_contact?: string | null
          hoa_email?: string | null
          hoa_name?: string | null
          hoa_phone?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          lockbox_code?: string | null
          longitude?: number | null
          lot_size_acres?: number | null
          lot_size_sqft?: number | null
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          parking_instructions?: string | null
          pet_info?: string | null
          photos?: Json | null
          property_age_range?:
            | Database["public"]["Enums"]["property_age_range"]
            | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          roof_age_years?: number | null
          roof_type?: string | null
          sewer_type?: string | null
          siding_type?: string | null
          special_conditions?: string | null
          square_footage?: number | null
          state?: string
          stories?: number | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          water_source?: string | null
          year_built?: number | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_sections: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_optional: boolean | null
          metadata: Json | null
          proposal_id: string
          section_order: number | null
          section_type: string | null
          show_line_items: boolean | null
          show_prices: boolean | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_optional?: boolean | null
          metadata?: Json | null
          proposal_id: string
          section_order?: number | null
          section_type?: string | null
          show_line_items?: boolean | null
          show_prices?: boolean | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_optional?: boolean | null
          metadata?: Json | null
          proposal_id?: string
          section_order?: number | null
          section_type?: string | null
          show_line_items?: boolean | null
          show_prices?: boolean | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_sections_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_sections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "proposal_sections_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          accepted_at: string | null
          ai_generated: boolean | null
          assumptions: string | null
          client_id: string
          cover_letter: string | null
          created_at: string | null
          custom_fields: Json | null
          declined_at: string | null
          declined_reason: string | null
          deleted_at: string | null
          deposit_amount: number | null
          deposit_percentage: number | null
          deposit_required: boolean | null
          estimate_id: string | null
          exclusions: string | null
          executive_summary: string | null
          id: string
          internal_notes: string | null
          metadata: Json | null
          methodology: string | null
          payment_schedule: string | null
          prepared_by: string | null
          project_id: string | null
          proposal_number: string | null
          qualifications: string | null
          requires_signature: boolean | null
          scope_of_work: string | null
          sent_at: string | null
          signature_envelope_id: string | null
          signature_provider: string | null
          signed_at: string | null
          signed_by: string | null
          status: Database["public"]["Enums"]["proposal_status"] | null
          tags: string[] | null
          template_id: string | null
          tenant_id: string
          terms_and_conditions: string | null
          tier: Database["public"]["Enums"]["proposal_tier"] | null
          timeline_description: string | null
          title: string
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
          view_count: number | null
          viewed_at: string | null
          warranty_details: string | null
        }
        Insert: {
          accepted_at?: string | null
          ai_generated?: boolean | null
          assumptions?: string | null
          client_id: string
          cover_letter?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          declined_at?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          deposit_required?: boolean | null
          estimate_id?: string | null
          exclusions?: string | null
          executive_summary?: string | null
          id?: string
          internal_notes?: string | null
          metadata?: Json | null
          methodology?: string | null
          payment_schedule?: string | null
          prepared_by?: string | null
          project_id?: string | null
          proposal_number?: string | null
          qualifications?: string | null
          requires_signature?: boolean | null
          scope_of_work?: string | null
          sent_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          tags?: string[] | null
          template_id?: string | null
          tenant_id: string
          terms_and_conditions?: string | null
          tier?: Database["public"]["Enums"]["proposal_tier"] | null
          timeline_description?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
          viewed_at?: string | null
          warranty_details?: string | null
        }
        Update: {
          accepted_at?: string | null
          ai_generated?: boolean | null
          assumptions?: string | null
          client_id?: string
          cover_letter?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          declined_at?: string | null
          declined_reason?: string | null
          deleted_at?: string | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          deposit_required?: boolean | null
          estimate_id?: string | null
          exclusions?: string | null
          executive_summary?: string | null
          id?: string
          internal_notes?: string | null
          metadata?: Json | null
          methodology?: string | null
          payment_schedule?: string | null
          prepared_by?: string | null
          project_id?: string | null
          proposal_number?: string | null
          qualifications?: string | null
          requires_signature?: boolean | null
          scope_of_work?: string | null
          sent_at?: string | null
          signature_envelope_id?: string | null
          signature_provider?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          tags?: string[] | null
          template_id?: string | null
          tenant_id?: string
          terms_and_conditions?: string | null
          tier?: Database["public"]["Enums"]["proposal_tier"] | null
          timeline_description?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
          view_count?: number | null
          viewed_at?: string | null
          warranty_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "proposals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_line_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          line_order: number | null
          material_id: string | null
          metadata: Json | null
          name: string
          notes: string | null
          purchase_order_id: string
          quantity_ordered: number | null
          quantity_received: number | null
          received_by: string | null
          received_date: string | null
          sku: string | null
          subtotal: number | null
          tenant_id: string
          unit: Database["public"]["Enums"]["material_unit"] | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          line_order?: number | null
          material_id?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          purchase_order_id: string
          quantity_ordered?: number | null
          quantity_received?: number | null
          received_by?: string | null
          received_date?: string | null
          sku?: string | null
          subtotal?: number | null
          tenant_id: string
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          line_order?: number | null
          material_id?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          purchase_order_id?: string
          quantity_ordered?: number | null
          quantity_received?: number | null
          received_by?: string | null
          received_date?: string | null
          sku?: string | null
          subtotal?: number | null
          tenant_id?: string
          unit?: Database["public"]["Enums"]["material_unit"] | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_line_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_items_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "purchase_order_line_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_instructions: string | null
          description: string | null
          expected_delivery_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_date: string | null
          po_number: string
          project_id: string | null
          shipping_amount: number | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          tenant_id: string
          terms: string | null
          title: string | null
          total: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_date?: string | null
          po_number: string
          project_id?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tenant_id: string
          terms?: string | null
          title?: string | null
          total?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_date?: string | null
          po_number?: string
          project_id?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tenant_id?: string
          terms?: string | null
          title?: string | null
          total?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_po_vendor"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "purchase_orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          browser: string | null
          created_at: string | null
          device_type: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          p256dh: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          auth: string
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh: string
          tenant_id: string
          user_id: string
        }
        Update: {
          auth?: string
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          p256dh?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "push_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          client_id: string | null
          created_at: string | null
          display_on_website: boolean | null
          external_review_id: string | null
          external_url: string | null
          id: string
          internal_notes: string | null
          is_featured: boolean | null
          metadata: Json | null
          project_id: string | null
          project_type: Database["public"]["Enums"]["project_type"] | null
          rating: number
          response: string | null
          response_at: string | null
          response_by: string | null
          review_date: string | null
          reviewer_name: string | null
          reviewer_photo_url: string | null
          service_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          sort_order: number | null
          source: Database["public"]["Enums"]["review_source"] | null
          status: Database["public"]["Enums"]["review_status"] | null
          tenant_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          client_id?: string | null
          created_at?: string | null
          display_on_website?: boolean | null
          external_review_id?: string | null
          external_url?: string | null
          id?: string
          internal_notes?: string | null
          is_featured?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          rating: number
          response?: string | null
          response_at?: string | null
          response_by?: string | null
          review_date?: string | null
          reviewer_name?: string | null
          reviewer_photo_url?: string | null
          service_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          sort_order?: number | null
          source?: Database["public"]["Enums"]["review_source"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          tenant_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          client_id?: string | null
          created_at?: string | null
          display_on_website?: boolean | null
          external_review_id?: string | null
          external_url?: string | null
          id?: string
          internal_notes?: string | null
          is_featured?: boolean | null
          metadata?: Json | null
          project_id?: string | null
          project_type?: Database["public"]["Enums"]["project_type"] | null
          rating?: number
          response?: string | null
          response_at?: string | null
          response_by?: string | null
          review_date?: string | null
          reviewer_name?: string | null
          reviewer_photo_url?: string | null
          service_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          sort_order?: number | null
          source?: Database["public"]["Enums"]["review_source"] | null
          status?: Database["public"]["Enums"]["review_status"] | null
          tenant_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_response_by_fkey"
            columns: ["response_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "reviews_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_incidents: {
        Row: {
          contributing_factors: string | null
          corrective_actions: string | null
          created_at: string | null
          description: string
          documents: Json | null
          estimated_damage_cost: number | null
          hospital_name: string | null
          id: string
          incident_date: string
          incident_time: string | null
          incident_type: Database["public"]["Enums"]["incident_type"]
          injuries_description: string | null
          insurance_claim_number: string | null
          investigated_by: string | null
          investigation_date: string | null
          investigation_notes: string | null
          involved_employee_ids: string[] | null
          location: string | null
          lost_time_days: number | null
          medical_treatment: string | null
          metadata: Json | null
          notes: string | null
          osha_report_number: string | null
          osha_reportable: boolean | null
          photos: Json | null
          preventive_actions: string | null
          project_id: string | null
          property_damage_description: string | null
          reported_by: string | null
          reported_to_insurance: boolean | null
          resolution_notes: string | null
          resolved_date: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: Database["public"]["Enums"]["incident_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
          witness_names: string[] | null
        }
        Insert: {
          contributing_factors?: string | null
          corrective_actions?: string | null
          created_at?: string | null
          description: string
          documents?: Json | null
          estimated_damage_cost?: number | null
          hospital_name?: string | null
          id?: string
          incident_date: string
          incident_time?: string | null
          incident_type: Database["public"]["Enums"]["incident_type"]
          injuries_description?: string | null
          insurance_claim_number?: string | null
          investigated_by?: string | null
          investigation_date?: string | null
          investigation_notes?: string | null
          involved_employee_ids?: string[] | null
          location?: string | null
          lost_time_days?: number | null
          medical_treatment?: string | null
          metadata?: Json | null
          notes?: string | null
          osha_report_number?: string | null
          osha_reportable?: boolean | null
          photos?: Json | null
          preventive_actions?: string | null
          project_id?: string | null
          property_damage_description?: string | null
          reported_by?: string | null
          reported_to_insurance?: boolean | null
          resolution_notes?: string | null
          resolved_date?: string | null
          root_cause?: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
          witness_names?: string[] | null
        }
        Update: {
          contributing_factors?: string | null
          corrective_actions?: string | null
          created_at?: string | null
          description?: string
          documents?: Json | null
          estimated_damage_cost?: number | null
          hospital_name?: string | null
          id?: string
          incident_date?: string
          incident_time?: string | null
          incident_type?: Database["public"]["Enums"]["incident_type"]
          injuries_description?: string | null
          insurance_claim_number?: string | null
          investigated_by?: string | null
          investigation_date?: string | null
          investigation_notes?: string | null
          involved_employee_ids?: string[] | null
          location?: string | null
          lost_time_days?: number | null
          medical_treatment?: string | null
          metadata?: Json | null
          notes?: string | null
          osha_report_number?: string | null
          osha_reportable?: boolean | null
          photos?: Json | null
          preventive_actions?: string | null
          project_id?: string | null
          property_damage_description?: string | null
          reported_by?: string | null
          reported_to_insurance?: boolean | null
          resolution_notes?: string | null
          resolved_date?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
          witness_names?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_incidents_investigated_by_fkey"
            columns: ["investigated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "safety_incidents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_incidents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "safety_incidents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_reports: {
        Row: {
          chart_config: Json | null
          columns: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          filters: Json | null
          group_by: Json | null
          id: string
          is_favorite: boolean | null
          is_scheduled: boolean | null
          is_shared: boolean | null
          last_run_at: string | null
          metadata: Json | null
          name: string
          next_run_at: string | null
          query_config: Json
          report_type: string
          schedule_frequency:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          schedule_recipients: string[] | null
          shared_with: string[] | null
          sort_config: Json | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          chart_config?: Json | null
          columns?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filters?: Json | null
          group_by?: Json | null
          id?: string
          is_favorite?: boolean | null
          is_scheduled?: boolean | null
          is_shared?: boolean | null
          last_run_at?: string | null
          metadata?: Json | null
          name: string
          next_run_at?: string | null
          query_config?: Json
          report_type: string
          schedule_frequency?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          schedule_recipients?: string[] | null
          shared_with?: string[] | null
          sort_config?: Json | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          chart_config?: Json | null
          columns?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          filters?: Json | null
          group_by?: Json | null
          id?: string
          is_favorite?: boolean | null
          is_scheduled?: boolean | null
          is_shared?: boolean | null
          last_run_at?: string | null
          metadata?: Json | null
          name?: string
          next_run_at?: string | null
          query_config?: Json
          report_type?: string
          schedule_frequency?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          schedule_recipients?: string[] | null
          shared_with?: string[] | null
          sort_config?: Json | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_reports_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "saved_reports_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_events: {
        Row: {
          all_day: boolean | null
          assigned_crew_id: string | null
          assigned_employee_ids: string[] | null
          assigned_to: string | null
          client_confirmed: boolean | null
          client_confirmed_at: string | null
          client_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          end_time: string
          event_type: Database["public"]["Enums"]["schedule_event_type"] | null
          google_calendar_id: string | null
          google_event_id: string | null
          id: string
          internal_notes: string | null
          is_recurring: boolean | null
          lead_id: string | null
          location: string | null
          location_latitude: number | null
          location_longitude: number | null
          metadata: Json | null
          notes: string | null
          project_id: string | null
          recurrence_days: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_pattern:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_parent_id: string | null
          reminder_minutes: number[] | null
          reminder_sent: boolean | null
          start_time: string
          status: Database["public"]["Enums"]["schedule_status"] | null
          tags: string[] | null
          tenant_id: string
          timezone: string | null
          title: string
          updated_at: string | null
          visible_to_client: boolean | null
        }
        Insert: {
          all_day?: boolean | null
          assigned_crew_id?: string | null
          assigned_employee_ids?: string[] | null
          assigned_to?: string | null
          client_confirmed?: boolean | null
          client_confirmed_at?: string | null
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time: string
          event_type?: Database["public"]["Enums"]["schedule_event_type"] | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          lead_id?: string | null
          location?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          project_id?: string | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_parent_id?: string | null
          reminder_minutes?: number[] | null
          reminder_sent?: boolean | null
          start_time: string
          status?: Database["public"]["Enums"]["schedule_status"] | null
          tags?: string[] | null
          tenant_id: string
          timezone?: string | null
          title: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Update: {
          all_day?: boolean | null
          assigned_crew_id?: string | null
          assigned_employee_ids?: string[] | null
          assigned_to?: string | null
          client_confirmed?: boolean | null
          client_confirmed_at?: string | null
          client_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          end_time?: string
          event_type?: Database["public"]["Enums"]["schedule_event_type"] | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          internal_notes?: string | null
          is_recurring?: boolean | null
          lead_id?: string | null
          location?: string | null
          location_latitude?: number | null
          location_longitude?: number | null
          metadata?: Json | null
          notes?: string | null
          project_id?: string | null
          recurrence_days?: Database["public"]["Enums"]["day_of_week"][] | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?:
            | Database["public"]["Enums"]["recurrence_pattern"]
            | null
          recurring_parent_id?: string | null
          reminder_minutes?: number[] | null
          reminder_sent?: boolean | null
          start_time?: string
          status?: Database["public"]["Enums"]["schedule_status"] | null
          tags?: string[] | null
          tenant_id?: string
          timezone?: string | null
          title?: string
          updated_at?: string | null
          visible_to_client?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_events_assigned_crew_id_fkey"
            columns: ["assigned_crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "schedule_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_recurring_parent_id_fkey"
            columns: ["recurring_parent_id"]
            isOneToOne: false
            referencedRelation: "schedule_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "schedule_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_catalog: {
        Row: {
          base_price: number | null
          booking_enabled: boolean | null
          booking_questions: Json | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          detailed_description: string | null
          difficulty: Database["public"]["Enums"]["service_difficulty"] | null
          display_order: number | null
          estimated_duration_days: number | null
          estimated_duration_hours: number | null
          icon: string | null
          id: string
          image_url: string | null
          instant_pricing_enabled: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          keywords: string[] | null
          maximum_price: number | null
          meta_description: string | null
          meta_title: string | null
          metadata: Json | null
          minimum_price: number | null
          name: string
          price_per_unit: number | null
          pricing_model:
            | Database["public"]["Enums"]["service_pricing_model"]
            | null
          requires_site_visit: boolean | null
          slug: string | null
          tags: string[] | null
          tenant_id: string
          trade_category: Database["public"]["Enums"]["trade_category"] | null
          unit: Database["public"]["Enums"]["material_unit"] | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          booking_enabled?: boolean | null
          booking_questions?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          detailed_description?: string | null
          difficulty?: Database["public"]["Enums"]["service_difficulty"] | null
          display_order?: number | null
          estimated_duration_days?: number | null
          estimated_duration_hours?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          instant_pricing_enabled?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          keywords?: string[] | null
          maximum_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          minimum_price?: number | null
          name: string
          price_per_unit?: number | null
          pricing_model?:
            | Database["public"]["Enums"]["service_pricing_model"]
            | null
          requires_site_visit?: boolean | null
          slug?: string | null
          tags?: string[] | null
          tenant_id: string
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          booking_enabled?: boolean | null
          booking_questions?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          detailed_description?: string | null
          difficulty?: Database["public"]["Enums"]["service_difficulty"] | null
          display_order?: number | null
          estimated_duration_days?: number | null
          estimated_duration_hours?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          instant_pricing_enabled?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          keywords?: string[] | null
          maximum_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          minimum_price?: number | null
          name?: string
          price_per_unit?: number | null
          pricing_model?:
            | Database["public"]["Enums"]["service_pricing_model"]
            | null
          requires_site_visit?: boolean | null
          slug?: string | null
          tags?: string[] | null
          tenant_id?: string
          trade_category?: Database["public"]["Enums"]["trade_category"] | null
          unit?: Database["public"]["Enums"]["material_unit"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_catalog_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "service_catalog_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_log: {
        Row: {
          body: string
          cost: number | null
          created_at: string | null
          direction: Database["public"]["Enums"]["message_direction"] | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_number: string
          id: string
          metadata: Json | null
          segments: number | null
          status: Database["public"]["Enums"]["message_status"] | null
          tenant_id: string
          to_number: string
          twilio_sid: string | null
          twilio_status: string | null
        }
        Insert: {
          body: string
          cost?: number | null
          created_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"] | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_number: string
          id?: string
          metadata?: Json | null
          segments?: number | null
          status?: Database["public"]["Enums"]["message_status"] | null
          tenant_id: string
          to_number: string
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Update: {
          body?: string
          cost?: number | null
          created_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"] | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["activity_entity_type"]
            | null
          from_number?: string
          id?: string
          metadata?: Json | null
          segments?: number | null
          status?: Database["public"]["Enums"]["message_status"] | null
          tenant_id?: string
          to_number?: string
          twilio_sid?: string | null
          twilio_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "sms_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      subcontractors: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          auto_insurance_expiry: string | null
          auto_insurance_policy: string | null
          bond_amount: number | null
          bonded: boolean | null
          city: string | null
          company_name: string
          contact_first_name: string | null
          contact_last_name: string | null
          contractor_license: string | null
          contractor_license_expiry: string | null
          contractor_license_state: string | null
          created_at: string | null
          custom_fields: Json | null
          dba_name: string | null
          default_markup: number | null
          default_pay_type: Database["public"]["Enums"]["pay_type"] | null
          default_rate: number | null
          deleted_at: string | null
          ein: string | null
          email: string | null
          general_liability_amount: number | null
          general_liability_expiry: string | null
          general_liability_policy: string | null
          id: string
          insurance_certificate_url: string | null
          is_active: boolean | null
          is_approved: boolean | null
          is_preferred: boolean | null
          metadata: Json | null
          notes: string | null
          overall_rating: number | null
          phone: string | null
          phone_secondary: string | null
          price_rating: number | null
          quality_rating: number | null
          reliability_rating: number | null
          service_area: string | null
          specialties: string[] | null
          state: string | null
          tags: string[] | null
          tenant_id: string
          total_paid: number | null
          total_projects: number | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
          user_id: string | null
          w9_on_file: boolean | null
          w9_received_date: string | null
          website: string | null
          workers_comp_expiry: string | null
          workers_comp_policy: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          auto_insurance_expiry?: string | null
          auto_insurance_policy?: string | null
          bond_amount?: number | null
          bonded?: boolean | null
          city?: string | null
          company_name: string
          contact_first_name?: string | null
          contact_last_name?: string | null
          contractor_license?: string | null
          contractor_license_expiry?: string | null
          contractor_license_state?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dba_name?: string | null
          default_markup?: number | null
          default_pay_type?: Database["public"]["Enums"]["pay_type"] | null
          default_rate?: number | null
          deleted_at?: string | null
          ein?: string | null
          email?: string | null
          general_liability_amount?: number | null
          general_liability_expiry?: string | null
          general_liability_policy?: string | null
          id?: string
          insurance_certificate_url?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_preferred?: boolean | null
          metadata?: Json | null
          notes?: string | null
          overall_rating?: number | null
          phone?: string | null
          phone_secondary?: string | null
          price_rating?: number | null
          quality_rating?: number | null
          reliability_rating?: number | null
          service_area?: string | null
          specialties?: string[] | null
          state?: string | null
          tags?: string[] | null
          tenant_id: string
          total_paid?: number | null
          total_projects?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          user_id?: string | null
          w9_on_file?: boolean | null
          w9_received_date?: string | null
          website?: string | null
          workers_comp_expiry?: string | null
          workers_comp_policy?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          auto_insurance_expiry?: string | null
          auto_insurance_policy?: string | null
          bond_amount?: number | null
          bonded?: boolean | null
          city?: string | null
          company_name?: string
          contact_first_name?: string | null
          contact_last_name?: string | null
          contractor_license?: string | null
          contractor_license_expiry?: string | null
          contractor_license_state?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dba_name?: string | null
          default_markup?: number | null
          default_pay_type?: Database["public"]["Enums"]["pay_type"] | null
          default_rate?: number | null
          deleted_at?: string | null
          ein?: string | null
          email?: string | null
          general_liability_amount?: number | null
          general_liability_expiry?: string | null
          general_liability_policy?: string | null
          id?: string
          insurance_certificate_url?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_preferred?: boolean | null
          metadata?: Json | null
          notes?: string | null
          overall_rating?: number | null
          phone?: string | null
          phone_secondary?: string | null
          price_rating?: number | null
          quality_rating?: number | null
          reliability_rating?: number | null
          service_area?: string | null
          specialties?: string[] | null
          state?: string | null
          tags?: string[] | null
          tenant_id?: string
          total_paid?: number | null
          total_projects?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          user_id?: string | null
          w9_on_file?: boolean | null
          w9_received_date?: string | null
          website?: string | null
          workers_comp_expiry?: string | null
          workers_comp_policy?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcontractors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "subcontractors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontractors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          created_at: string | null
          direction: string
          entity_id: string | null
          entity_type: string
          error_message: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          metadata: Json | null
          status: string
          sync_data: Json | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          direction: string
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          metadata?: Json | null
          status: string
          sync_data?: Json | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          direction?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          metadata?: Json | null
          status?: string
          sync_data?: Json | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integration_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "sync_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_assignments: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tag_entity_type"]
          id: string
          tag_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["tag_entity_type"]
          id?: string
          tag_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["tag_entity_type"]
          id?: string
          tag_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tag_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          entity_type: Database["public"]["Enums"]["tag_entity_type"] | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          entity_type?: Database["public"]["Enums"]["tag_entity_type"] | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          entity_type?: Database["public"]["Enums"]["tag_entity_type"] | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string | null
          depends_on_task_id: string
          id: string
          lag_days: number | null
          task_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id: string
          id?: string
          lag_days?: number | null
          task_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string | null
          depends_on_task_id?: string
          id?: string
          lag_days?: number | null
          task_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "task_dependencies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_domains: {
        Row: {
          created_at: string | null
          dns_records: Json | null
          domain: string
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          ssl_provisioned: boolean | null
          tenant_id: string
          updated_at: string | null
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          dns_records?: Json | null
          domain: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          ssl_provisioned?: boolean | null
          tenant_id: string
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          dns_records?: Json | null
          domain?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          ssl_provisioned?: boolean | null
          tenant_id?: string
          updated_at?: string | null
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_domains_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_sequences: {
        Row: {
          current_value: number | null
          id: string
          padding: number | null
          prefix: string | null
          sequence_name: string
          tenant_id: string
        }
        Insert: {
          current_value?: number | null
          id?: string
          padding?: number | null
          prefix?: string | null
          sequence_name: string
          tenant_id: string
        }
        Update: {
          current_value?: number | null
          id?: string
          padding?: number | null
          prefix?: string | null
          sequence_name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_sequences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_sequences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_themes: {
        Row: {
          border_radius: string | null
          color_accent: string | null
          color_background: string | null
          color_error: string | null
          color_info: string | null
          color_primary: string | null
          color_secondary: string | null
          color_success: string | null
          color_surface: string | null
          color_text: string | null
          color_text_secondary: string | null
          color_warning: string | null
          created_at: string | null
          custom_css: string | null
          custom_head_html: string | null
          favicon_url: string | null
          font_accent: string | null
          font_body: string | null
          font_heading: string | null
          footer_style: string | null
          header_style: string | null
          id: string
          is_active: boolean | null
          logo_dark_url: string | null
          logo_icon_url: string | null
          logo_url: string | null
          og_image_url: string | null
          sidebar_position: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          border_radius?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_error?: string | null
          color_info?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          color_success?: string | null
          color_surface?: string | null
          color_text?: string | null
          color_text_secondary?: string | null
          color_warning?: string | null
          created_at?: string | null
          custom_css?: string | null
          custom_head_html?: string | null
          favicon_url?: string | null
          font_accent?: string | null
          font_body?: string | null
          font_heading?: string | null
          footer_style?: string | null
          header_style?: string | null
          id?: string
          is_active?: boolean | null
          logo_dark_url?: string | null
          logo_icon_url?: string | null
          logo_url?: string | null
          og_image_url?: string | null
          sidebar_position?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          border_radius?: string | null
          color_accent?: string | null
          color_background?: string | null
          color_error?: string | null
          color_info?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          color_success?: string | null
          color_surface?: string | null
          color_text?: string | null
          color_text_secondary?: string | null
          color_warning?: string | null
          created_at?: string | null
          custom_css?: string | null
          custom_head_html?: string | null
          favicon_url?: string | null
          font_accent?: string | null
          font_body?: string | null
          font_heading?: string | null
          footer_style?: string | null
          header_style?: string | null
          id?: string
          is_active?: boolean | null
          logo_dark_url?: string | null
          logo_icon_url?: string | null
          logo_url?: string | null
          og_image_url?: string | null
          sidebar_position?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_themes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "tenant_themes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          annual_revenue_range: string | null
          bond_amount: number | null
          bond_expiry: string | null
          bond_number: string | null
          business_entity_type: string | null
          city: string | null
          company_name: string
          contractor_license_expiry: string | null
          contractor_license_number: string | null
          contractor_license_state: string | null
          country: string | null
          county: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          dba_name: string | null
          default_markup_percentage: number | null
          default_payment_terms_days: number | null
          default_profit_margin: number | null
          default_retainage_percentage: number | null
          default_tax_rate: number | null
          default_warranty_days: number | null
          deleted_at: string | null
          ein: string | null
          email: string | null
          fax: string | null
          features: Json | null
          fiscal_year_start_month: number | null
          general_liability_expiry: string | null
          general_liability_policy: string | null
          id: string
          last_active_at: string | null
          latitude: number | null
          legal_name: string | null
          longitude: number | null
          metadata: Json | null
          monthly_price: number | null
          notes: string | null
          number_of_employees: number | null
          onboarding_completed_at: string | null
          phone: string | null
          phone_secondary: string | null
          plan: Database["public"]["Enums"]["tenant_plan"] | null
          service_area_description: string | null
          service_area_polygon: unknown
          service_area_radius_miles: number | null
          service_area_zip_codes: string[] | null
          settings: Json | null
          slug: string
          state: string | null
          state_tax_id: string | null
          status: Database["public"]["Enums"]["tenant_status"] | null
          stripe_connect_account_id: string | null
          stripe_connect_onboarded: boolean | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_started_at: string | null
          timezone: string | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          trial_ends_at: string | null
          updated_at: string | null
          website_url: string | null
          workers_comp_expiry: string | null
          workers_comp_policy: string | null
          working_days: Database["public"]["Enums"]["day_of_week"][] | null
          working_hours_end: string | null
          working_hours_start: string | null
          year_established: number | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue_range?: string | null
          bond_amount?: number | null
          bond_expiry?: string | null
          bond_number?: string | null
          business_entity_type?: string | null
          city?: string | null
          company_name: string
          contractor_license_expiry?: string | null
          contractor_license_number?: string | null
          contractor_license_state?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          dba_name?: string | null
          default_markup_percentage?: number | null
          default_payment_terms_days?: number | null
          default_profit_margin?: number | null
          default_retainage_percentage?: number | null
          default_tax_rate?: number | null
          default_warranty_days?: number | null
          deleted_at?: string | null
          ein?: string | null
          email?: string | null
          fax?: string | null
          features?: Json | null
          fiscal_year_start_month?: number | null
          general_liability_expiry?: string | null
          general_liability_policy?: string | null
          id?: string
          last_active_at?: string | null
          latitude?: number | null
          legal_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          monthly_price?: number | null
          notes?: string | null
          number_of_employees?: number | null
          onboarding_completed_at?: string | null
          phone?: string | null
          phone_secondary?: string | null
          plan?: Database["public"]["Enums"]["tenant_plan"] | null
          service_area_description?: string | null
          service_area_polygon?: unknown
          service_area_radius_miles?: number | null
          service_area_zip_codes?: string[] | null
          settings?: Json | null
          slug: string
          state?: string | null
          state_tax_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          stripe_connect_account_id?: string | null
          stripe_connect_onboarded?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          timezone?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          website_url?: string | null
          workers_comp_expiry?: string | null
          workers_comp_policy?: string | null
          working_days?: Database["public"]["Enums"]["day_of_week"][] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
          year_established?: number | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          annual_revenue_range?: string | null
          bond_amount?: number | null
          bond_expiry?: string | null
          bond_number?: string | null
          business_entity_type?: string | null
          city?: string | null
          company_name?: string
          contractor_license_expiry?: string | null
          contractor_license_number?: string | null
          contractor_license_state?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          dba_name?: string | null
          default_markup_percentage?: number | null
          default_payment_terms_days?: number | null
          default_profit_margin?: number | null
          default_retainage_percentage?: number | null
          default_tax_rate?: number | null
          default_warranty_days?: number | null
          deleted_at?: string | null
          ein?: string | null
          email?: string | null
          fax?: string | null
          features?: Json | null
          fiscal_year_start_month?: number | null
          general_liability_expiry?: string | null
          general_liability_policy?: string | null
          id?: string
          last_active_at?: string | null
          latitude?: number | null
          legal_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          monthly_price?: number | null
          notes?: string | null
          number_of_employees?: number | null
          onboarding_completed_at?: string | null
          phone?: string | null
          phone_secondary?: string | null
          plan?: Database["public"]["Enums"]["tenant_plan"] | null
          service_area_description?: string | null
          service_area_polygon?: unknown
          service_area_radius_miles?: number | null
          service_area_zip_codes?: string[] | null
          settings?: Json | null
          slug?: string
          state?: string | null
          state_tax_id?: string | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          stripe_connect_account_id?: string | null
          stripe_connect_onboarded?: boolean | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          timezone?: string | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          website_url?: string | null
          workers_comp_expiry?: string | null
          workers_comp_policy?: string | null
          working_days?: Database["public"]["Enums"]["day_of_week"][] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
          year_established?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          adjusted_at: string | null
          adjusted_by: string | null
          adjustment_reason: string | null
          approved_at: string | null
          approved_by: string | null
          bill_rate: number | null
          billable: boolean | null
          billable_amount: number | null
          break_minutes: number | null
          clock_in: string
          clock_in_address: string | null
          clock_in_latitude: number | null
          clock_in_longitude: number | null
          clock_out: string | null
          clock_out_address: string | null
          clock_out_latitude: number | null
          clock_out_longitude: number | null
          created_at: string | null
          description: string | null
          double_time_minutes: number | null
          employee_id: string | null
          entry_type: Database["public"]["Enums"]["time_entry_type"] | null
          id: string
          metadata: Json | null
          notes: string | null
          original_clock_in: string | null
          original_clock_out: string | null
          overtime_minutes: number | null
          overtime_rate: number | null
          pay_rate: number | null
          phase_id: string | null
          project_id: string | null
          rejected_reason: string | null
          status: Database["public"]["Enums"]["time_entry_status"] | null
          subcontractor_id: string | null
          task_id: string | null
          tenant_id: string
          total_hours: number | null
          total_minutes: number | null
          total_pay: number | null
          updated_at: string | null
        }
        Insert: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          adjustment_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bill_rate?: number | null
          billable?: boolean | null
          billable_amount?: number | null
          break_minutes?: number | null
          clock_in: string
          clock_in_address?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_out?: string | null
          clock_out_address?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          created_at?: string | null
          description?: string | null
          double_time_minutes?: number | null
          employee_id?: string | null
          entry_type?: Database["public"]["Enums"]["time_entry_type"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          original_clock_in?: string | null
          original_clock_out?: string | null
          overtime_minutes?: number | null
          overtime_rate?: number | null
          pay_rate?: number | null
          phase_id?: string | null
          project_id?: string | null
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["time_entry_status"] | null
          subcontractor_id?: string | null
          task_id?: string | null
          tenant_id: string
          total_hours?: number | null
          total_minutes?: number | null
          total_pay?: number | null
          updated_at?: string | null
        }
        Update: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          adjustment_reason?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bill_rate?: number | null
          billable?: boolean | null
          billable_amount?: number | null
          break_minutes?: number | null
          clock_in?: string
          clock_in_address?: string | null
          clock_in_latitude?: number | null
          clock_in_longitude?: number | null
          clock_out?: string | null
          clock_out_address?: string | null
          clock_out_latitude?: number | null
          clock_out_longitude?: number | null
          created_at?: string | null
          description?: string | null
          double_time_minutes?: number | null
          employee_id?: string | null
          entry_type?: Database["public"]["Enums"]["time_entry_type"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          original_clock_in?: string | null
          original_clock_out?: string | null
          overtime_minutes?: number | null
          overtime_rate?: number | null
          pay_rate?: number | null
          phase_id?: string | null
          project_id?: string | null
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["time_entry_status"] | null
          subcontractor_id?: string | null
          task_id?: string | null
          tenant_id?: string
          total_hours?: number | null
          total_minutes?: number | null
          total_pay?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_adjusted_by_fkey"
            columns: ["adjusted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "time_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_subcontractor_id_fkey"
            columns: ["subcontractor_id"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "time_entries_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          device_type: string | null
          ended_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity_at: string | null
          started_at: string | null
          tenant_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity_at?: string | null
          started_at?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity_at?: string | null
          started_at?: string | null
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "user_sessions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_provider: Database["public"]["Enums"]["auth_provider"] | null
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          email: string
          failed_login_count: number | null
          first_name: string | null
          id: string
          last_active_at: string | null
          last_login_at: string | null
          last_name: string | null
          locale: string | null
          locked_until: string | null
          login_count: number | null
          metadata: Json | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          password_changed_at: string | null
          permissions: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"] | null
          tenant_id: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email: string
          failed_login_count?: number | null
          first_name?: string | null
          id?: string
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          locked_until?: string | null
          login_count?: number | null
          metadata?: Json | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          password_changed_at?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          tenant_id?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auth_provider?: Database["public"]["Enums"]["auth_provider"] | null
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          failed_login_count?: number | null
          first_name?: string | null
          id?: string
          last_active_at?: string | null
          last_login_at?: string | null
          last_name?: string | null
          locale?: string | null
          locked_until?: string | null
          login_count?: number | null
          metadata?: Json | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          password_changed_at?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          tenant_id?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          assigned_to: string | null
          color: string | null
          condition: Database["public"]["Enums"]["equipment_condition"] | null
          created_at: string | null
          current_mileage: number | null
          current_value: number | null
          id: string
          insurance_expiry: string | null
          insurance_policy: string | null
          is_active: boolean | null
          last_service_date: string | null
          last_service_mileage: number | null
          lease_expiry: string | null
          license_plate: string | null
          license_plate_state: string | null
          make: string | null
          metadata: Json | null
          model: string | null
          monthly_payment: number | null
          next_service_date: string | null
          next_service_mileage: number | null
          notes: string | null
          ownership: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date: string | null
          purchase_price: number | null
          registration_expiry: string | null
          tenant_id: string
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vin: string | null
          year: number | null
        }
        Insert: {
          assigned_to?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["equipment_condition"] | null
          created_at?: string | null
          current_mileage?: number | null
          current_value?: number | null
          id?: string
          insurance_expiry?: string | null
          insurance_policy?: string | null
          is_active?: boolean | null
          last_service_date?: string | null
          last_service_mileage?: number | null
          lease_expiry?: string | null
          license_plate?: string | null
          license_plate_state?: string | null
          make?: string | null
          metadata?: Json | null
          model?: string | null
          monthly_payment?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          ownership?: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          tenant_id: string
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          vin?: string | null
          year?: number | null
        }
        Update: {
          assigned_to?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["equipment_condition"] | null
          created_at?: string | null
          current_mileage?: number | null
          current_value?: number | null
          id?: string
          insurance_expiry?: string | null
          insurance_policy?: string | null
          is_active?: boolean | null
          last_service_date?: string | null
          last_service_mileage?: number | null
          lease_expiry?: string | null
          license_plate?: string | null
          license_plate_state?: string | null
          make?: string | null
          metadata?: Json | null
          model?: string | null
          monthly_payment?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          ownership?: Database["public"]["Enums"]["equipment_ownership"] | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          tenant_id?: string
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          account_number: string | null
          address_line1: string | null
          address_line2: string | null
          categories: string[] | null
          city: string | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          credit_limit: number | null
          deleted_at: string | null
          delivery_rating: number | null
          email: string | null
          fax: string | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          is_preferred: boolean | null
          last_order_date: string | null
          metadata: Json | null
          notes: string | null
          overall_rating: number | null
          payment_terms: string | null
          payment_terms_days: number | null
          phone: string | null
          price_rating: number | null
          quality_rating: number | null
          state: string | null
          tags: string[] | null
          tax_exempt: boolean | null
          tenant_id: string
          total_orders: number | null
          total_spent: number | null
          trade_categories:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at: string | null
          vendor_type: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          categories?: string[] | null
          city?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          delivery_rating?: number | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_preferred?: boolean | null
          last_order_date?: string | null
          metadata?: Json | null
          notes?: string | null
          overall_rating?: number | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          price_rating?: number | null
          quality_rating?: number | null
          state?: string | null
          tags?: string[] | null
          tax_exempt?: boolean | null
          tenant_id: string
          total_orders?: number | null
          total_spent?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          vendor_type?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          account_number?: string | null
          address_line1?: string | null
          address_line2?: string | null
          categories?: string[] | null
          city?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deleted_at?: string | null
          delivery_rating?: number | null
          email?: string | null
          fax?: string | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          is_preferred?: boolean | null
          last_order_date?: string | null
          metadata?: Json | null
          notes?: string | null
          overall_rating?: number | null
          payment_terms?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          price_rating?: number | null
          quality_rating?: number | null
          state?: string | null
          tags?: string[] | null
          tax_exempt?: boolean | null
          tenant_id?: string
          total_orders?: number | null
          total_spent?: number | null
          trade_categories?:
            | Database["public"]["Enums"]["trade_category"][]
            | null
          updated_at?: string | null
          vendor_type?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "vendors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      warranties: {
        Row: {
          auto_remind: boolean | null
          client_id: string | null
          coverage_details: string | null
          created_at: string | null
          deductible: number | null
          description: string | null
          document_url: string | null
          end_date: string
          exclusions: string | null
          id: string
          is_renewable: boolean | null
          metadata: Json | null
          notes: string | null
          project_id: string
          provider_contact: string | null
          provider_email: string | null
          provider_name: string | null
          provider_phone: string | null
          provider_policy_number: string | null
          remind_days_before: number | null
          renewal_cost: number | null
          start_date: string
          status: Database["public"]["Enums"]["warranty_status"] | null
          tenant_id: string
          terms: string | null
          title: string
          updated_at: string | null
          warranty_type: Database["public"]["Enums"]["warranty_type"]
          warranty_value: number | null
        }
        Insert: {
          auto_remind?: boolean | null
          client_id?: string | null
          coverage_details?: string | null
          created_at?: string | null
          deductible?: number | null
          description?: string | null
          document_url?: string | null
          end_date: string
          exclusions?: string | null
          id?: string
          is_renewable?: boolean | null
          metadata?: Json | null
          notes?: string | null
          project_id: string
          provider_contact?: string | null
          provider_email?: string | null
          provider_name?: string | null
          provider_phone?: string | null
          provider_policy_number?: string | null
          remind_days_before?: number | null
          renewal_cost?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["warranty_status"] | null
          tenant_id: string
          terms?: string | null
          title: string
          updated_at?: string | null
          warranty_type: Database["public"]["Enums"]["warranty_type"]
          warranty_value?: number | null
        }
        Update: {
          auto_remind?: boolean | null
          client_id?: string | null
          coverage_details?: string | null
          created_at?: string | null
          deductible?: number | null
          description?: string | null
          document_url?: string | null
          end_date?: string
          exclusions?: string | null
          id?: string
          is_renewable?: boolean | null
          metadata?: Json | null
          notes?: string | null
          project_id?: string
          provider_contact?: string | null
          provider_email?: string | null
          provider_name?: string | null
          provider_phone?: string | null
          provider_policy_number?: string | null
          remind_days_before?: number | null
          renewal_cost?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["warranty_status"] | null
          tenant_id?: string
          terms?: string | null
          title?: string
          updated_at?: string | null
          warranty_type?: Database["public"]["Enums"]["warranty_type"]
          warranty_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "warranties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "warranties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_claims: {
        Row: {
          claim_number: string | null
          client_id: string | null
          client_responsibility: number | null
          covered_amount: number | null
          created_at: string | null
          description: string
          follow_up_project_id: string | null
          id: string
          metadata: Json | null
          notes: string | null
          photos: Json | null
          project_id: string | null
          repair_cost: number | null
          reported_date: string | null
          resolution: string | null
          resolution_date: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["warranty_claim_status"] | null
          tenant_id: string
          updated_at: string | null
          warranty_id: string
        }
        Insert: {
          claim_number?: string | null
          client_id?: string | null
          client_responsibility?: number | null
          covered_amount?: number | null
          created_at?: string | null
          description: string
          follow_up_project_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          photos?: Json | null
          project_id?: string | null
          repair_cost?: number | null
          reported_date?: string | null
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["warranty_claim_status"] | null
          tenant_id: string
          updated_at?: string | null
          warranty_id: string
        }
        Update: {
          claim_number?: string | null
          client_id?: string | null
          client_responsibility?: number | null
          covered_amount?: number | null
          created_at?: string | null
          description?: string
          follow_up_project_id?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          photos?: Json | null
          project_id?: string | null
          repair_cost?: number | null
          reported_date?: string | null
          resolution?: string | null
          resolution_date?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["warranty_claim_status"] | null
          tenant_id?: string
          updated_at?: string | null
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranty_claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_follow_up_project_id_fkey"
            columns: ["follow_up_project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "warranty_claims_follow_up_project_id_fkey"
            columns: ["follow_up_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mv_project_financials"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "warranty_claims_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "warranty_claims_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_log: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          event: Database["public"]["Enums"]["notification_type"]
          id: string
          request_body: Json | null
          response_body: string | null
          response_code: number | null
          retry_count: number | null
          status: string
          tenant_id: string
          webhook_id: string
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          event: Database["public"]["Enums"]["notification_type"]
          id?: string
          request_body?: Json | null
          response_body?: string | null
          response_code?: number | null
          retry_count?: number | null
          status: string
          tenant_id: string
          webhook_id: string
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          event?: Database["public"]["Enums"]["notification_type"]
          id?: string
          request_body?: Json | null
          response_body?: string | null
          response_code?: number | null
          retry_count?: number | null
          status?: string
          tenant_id?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "webhook_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_log_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: Database["public"]["Enums"]["notification_type"][]
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_response_code: number | null
          last_triggered_at: string | null
          metadata: Json | null
          name: string
          secret: string | null
          tenant_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          events: Database["public"]["Enums"]["notification_type"][]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_response_code?: number | null
          last_triggered_at?: string | null
          metadata?: Json | null
          name: string
          secret?: string | null
          tenant_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          events?: Database["public"]["Enums"]["notification_type"][]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_response_code?: number | null
          last_triggered_at?: string | null
          metadata?: Json | null
          name?: string
          secret?: string | null
          tenant_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "webhooks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      website_pages: {
        Row: {
          canonical_url: string | null
          content_blocks: Json | null
          created_at: string | null
          id: string
          layout: string | null
          menu_order: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          metadata: Json | null
          no_index: boolean | null
          og_description: string | null
          og_image_url: string | null
          og_title: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          parent_page_id: string | null
          published_at: string | null
          show_in_footer: boolean | null
          show_in_menu: boolean | null
          slug: string
          status: Database["public"]["Enums"]["page_status"] | null
          template: string | null
          tenant_id: string
          title: string
          unpublished_at: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          canonical_url?: string | null
          content_blocks?: Json | null
          created_at?: string | null
          id?: string
          layout?: string | null
          menu_order?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          metadata?: Json | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          page_type: Database["public"]["Enums"]["page_type"]
          parent_page_id?: string | null
          published_at?: string | null
          show_in_footer?: boolean | null
          show_in_menu?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"] | null
          template?: string | null
          tenant_id: string
          title: string
          unpublished_at?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          canonical_url?: string | null
          content_blocks?: Json | null
          created_at?: string | null
          id?: string
          layout?: string | null
          menu_order?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          metadata?: Json | null
          no_index?: boolean | null
          og_description?: string | null
          og_image_url?: string | null
          og_title?: string | null
          page_type?: Database["public"]["Enums"]["page_type"]
          parent_page_id?: string | null
          published_at?: string | null
          show_in_footer?: boolean | null
          show_in_menu?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"] | null
          template?: string | null
          tenant_id?: string
          title?: string
          unpublished_at?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "website_pages_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "website_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "website_pages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      mv_project_financials: {
        Row: {
          change_order_total: number | null
          contract_amount: number | null
          gross_margin_pct: number | null
          gross_profit: number | null
          project_id: string | null
          project_name: string | null
          project_number: string | null
          revised_amount: number | null
          status: Database["public"]["Enums"]["project_status"] | null
          tenant_id: string | null
          total_expenses: number | null
          total_invoiced: number | null
          total_paid: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "mv_tenant_dashboard"
            referencedColumns: ["tenant_id"]
          },
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_tenant_dashboard: {
        Row: {
          active_leads: number | null
          active_projects: number | null
          company_name: string | null
          completed_projects: number | null
          overdue_invoices: number | null
          revenue_this_month: number | null
          revenue_this_year: number | null
          tenant_id: string | null
          total_clients: number | null
          total_outstanding: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      apply_updated_at_trigger: { Args: { tbl: string }; Returns: undefined }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_current_tenant_id: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      gettransactionid: { Args: never; Returns: unknown }
      initialize_tenant_sequences: {
        Args: { p_tenant_id: string }
        Returns: undefined
      }
      is_platform_admin: { Args: never; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      next_sequence: {
        Args: { p_sequence_name: string; p_tenant_id: string }
        Returns: string
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      refresh_materialized_views: { Args: never; Returns: undefined }
      resolve_ai_model: {
        Args: {
          p_module: Database["public"]["Enums"]["ai_module"]
          p_tenant_id: string
        }
        Returns: {
          ab_test_id: string
          ab_variant: string
          api_base_url: string
          api_model_id: string
          max_tokens: number
          model_key: string
          provider: Database["public"]["Enums"]["ai_provider"]
          system_prompt_override: string
          temperature: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      ab_test_status: "draft" | "running" | "paused" | "completed" | "cancelled"
      activity_action:
        | "created"
        | "updated"
        | "deleted"
        | "restored"
        | "viewed"
        | "downloaded"
        | "printed"
        | "shared"
        | "exported"
        | "sent"
        | "received"
        | "opened"
        | "clicked"
        | "signed"
        | "approved"
        | "rejected"
        | "revoked"
        | "assigned"
        | "unassigned"
        | "reassigned"
        | "started"
        | "paused"
        | "resumed"
        | "completed"
        | "cancelled"
        | "clocked_in"
        | "clocked_out"
        | "paid"
        | "refunded"
        | "voided"
        | "commented"
        | "mentioned"
        | "tagged"
        | "uploaded"
        | "archived"
        | "unarchived"
        | "merged"
        | "split"
        | "duplicated"
        | "converted"
        | "imported"
        | "synced"
        | "logged_in"
        | "logged_out"
        | "password_changed"
        | "setting_changed"
        | "role_changed"
        | "ai_generated"
        | "ai_edited"
        | "status_changed"
        | "priority_changed"
        | "other"
      activity_entity_type:
        | "lead"
        | "client"
        | "contact"
        | "property"
        | "project"
        | "task"
        | "phase"
        | "estimate"
        | "proposal"
        | "contract"
        | "change_order"
        | "lien_waiver"
        | "invoice"
        | "payment"
        | "expense"
        | "employee"
        | "subcontractor"
        | "vendor"
        | "time_entry"
        | "schedule_event"
        | "document"
        | "message"
        | "notification"
        | "permit"
        | "inspection"
        | "warranty"
        | "warranty_claim"
        | "review"
        | "vehicle"
        | "equipment"
        | "ai_generation"
        | "setting"
        | "user"
        | "tenant"
        | "other"
      ai_feedback:
        | "thumbs_up"
        | "thumbs_down"
        | "edited_and_used"
        | "used_as_is"
        | "discarded"
        | "regenerated"
        | "no_feedback"
      ai_generation_type:
        | "scope_of_work"
        | "contract_draft"
        | "estimate"
        | "proposal"
        | "email_draft"
        | "sms_draft"
        | "change_order_analysis"
        | "photo_analysis"
        | "schedule_optimization"
        | "financial_analysis"
        | "client_communication"
        | "project_summary"
        | "meeting_notes"
        | "daily_log_summary"
        | "material_list"
        | "punch_list"
        | "safety_plan"
        | "risk_assessment"
        | "warranty_document"
        | "maintenance_plan"
        | "marketing_content"
        | "social_media_post"
        | "job_description"
        | "review_response"
        | "faq_answer"
        | "chatbot_response"
        | "data_extraction"
        | "document_summary"
        | "translation"
        | "custom"
      ai_module:
        | "scope_generator"
        | "contract_drafter"
        | "estimate_builder"
        | "proposal_writer"
        | "email_composer"
        | "sms_composer"
        | "change_order_analyzer"
        | "photo_analyzer"
        | "schedule_optimizer"
        | "financial_analyst"
        | "client_communicator"
        | "project_summarizer"
        | "daily_log_writer"
        | "material_estimator"
        | "punch_list_generator"
        | "safety_planner"
        | "risk_assessor"
        | "warranty_writer"
        | "maintenance_planner"
        | "marketing_writer"
        | "social_media_writer"
        | "review_responder"
        | "faq_generator"
        | "chatbot"
        | "data_extractor"
        | "document_summarizer"
        | "translator"
        | "booking_assistant"
        | "search"
        | "general"
      ai_provider:
        | "anthropic"
        | "openai"
        | "google"
        | "mistral"
        | "meta"
        | "cohere"
        | "perplexity"
        | "groq"
        | "together"
        | "aws_bedrock"
        | "azure_openai"
        | "vertex_ai"
        | "local"
        | "custom"
      ai_routing_strategy:
        | "primary_only"
        | "fallback"
        | "ab_test"
        | "round_robin"
        | "cost_optimized"
        | "latency_optimized"
        | "quality_optimized"
        | "manual"
      auth_provider:
        | "email"
        | "google"
        | "apple"
        | "microsoft"
        | "phone"
        | "magic_link"
        | "sso"
      certification_status:
        | "active"
        | "expired"
        | "pending_renewal"
        | "suspended"
        | "revoked"
        | "not_applicable"
        | "in_progress"
      certification_type:
        | "general_contractor_license"
        | "specialty_contractor_license"
        | "electrical_license"
        | "plumbing_license"
        | "hvac_license"
        | "gas_fitter_license"
        | "fire_protection_license"
        | "asbestos_certification"
        | "lead_paint_certification"
        | "mold_certification"
        | "radon_certification"
        | "epa_certification"
        | "osha_10"
        | "osha_30"
        | "first_aid_cpr"
        | "confined_space"
        | "fall_protection"
        | "scaffolding"
        | "forklift_operator"
        | "crane_operator"
        | "cdl_class_a"
        | "cdl_class_b"
        | "welding_certification"
        | "brazing_certification"
        | "backflow_preventer"
        | "fire_alarm"
        | "low_voltage"
        | "structured_cabling"
        | "pool_contractor"
        | "irrigation"
        | "pesticide_applicator"
        | "arborist"
        | "home_inspector"
        | "energy_auditor"
        | "leed_certification"
        | "nahb_certification"
        | "nari_certification"
        | "epa_renovation"
        | "bonded"
        | "insured"
        | "drug_test"
        | "background_check"
        | "safety_training"
        | "equipment_operation"
        | "manufacturer_certified"
        | "other"
      change_order_reason:
        | "client_request"
        | "unforeseen_condition"
        | "design_error"
        | "design_change"
        | "code_requirement"
        | "material_substitution"
        | "material_unavailable"
        | "scope_clarification"
        | "value_engineering"
        | "site_condition"
        | "weather_damage"
        | "structural_issue"
        | "inspection_requirement"
        | "permit_requirement"
        | "safety_concern"
        | "schedule_acceleration"
        | "owner_furnished_item_change"
        | "subcontractor_issue"
        | "price_escalation"
        | "other"
      change_order_status:
        | "draft"
        | "pending_approval_internal"
        | "pending_approval_client"
        | "approved"
        | "declined"
        | "revised"
        | "voided"
        | "in_progress"
        | "completed"
        | "disputed"
        | "archived"
      client_type:
        | "residential_homeowner"
        | "residential_renter"
        | "residential_landlord"
        | "commercial_owner"
        | "commercial_tenant"
        | "commercial_manager"
        | "property_management_company"
        | "real_estate_agent"
        | "real_estate_investor"
        | "hoa"
        | "condo_association"
        | "government"
        | "nonprofit"
        | "religious_organization"
        | "insurance_company"
        | "warranty_company"
        | "general_contractor"
        | "developer"
        | "builder"
        | "other"
      contact_method_preference:
        | "phone_call"
        | "text_sms"
        | "email"
        | "in_app"
        | "no_preference"
      content_block_type:
        | "hero"
        | "text"
        | "image"
        | "video"
        | "gallery"
        | "cta"
        | "testimonial"
        | "faq"
        | "form"
        | "service_cards"
        | "team_members"
        | "stats"
        | "before_after"
        | "map"
        | "pricing_table"
        | "contact_info"
        | "social_links"
        | "html_embed"
        | "divider"
        | "spacer"
        | "columns"
        | "accordion"
        | "tabs"
        | "timeline"
        | "process_steps"
        | "logo_cloud"
        | "feature_grid"
        | "custom"
      contract_clause_type:
        | "scope_of_work"
        | "payment_terms"
        | "schedule"
        | "change_order_process"
        | "warranty"
        | "liability"
        | "indemnification"
        | "insurance_requirements"
        | "dispute_resolution"
        | "termination"
        | "force_majeure"
        | "safety_requirements"
        | "cleanup"
        | "permits_licenses"
        | "material_specifications"
        | "workmanship_standards"
        | "inspection_rights"
        | "lien_waiver"
        | "retainage"
        | "liquidated_damages"
        | "bonus_incentive"
        | "confidentiality"
        | "non_compete"
        | "non_solicitation"
        | "assignment"
        | "subcontracting"
        | "governing_law"
        | "notice_requirements"
        | "entire_agreement"
        | "severability"
        | "amendment_process"
        | "site_access"
        | "working_hours"
        | "noise_restrictions"
        | "environmental_compliance"
        | "hazardous_materials"
        | "owner_responsibilities"
        | "custom"
      contract_status:
        | "draft"
        | "pending_review"
        | "pending_signature_contractor"
        | "pending_signature_client"
        | "partially_signed"
        | "fully_executed"
        | "active"
        | "amended"
        | "on_hold"
        | "breached"
        | "terminated"
        | "completed"
        | "expired"
        | "voided"
        | "disputed"
        | "archived"
      contract_type:
        | "fixed_price"
        | "cost_plus_fixed_fee"
        | "cost_plus_percentage"
        | "time_and_materials"
        | "guaranteed_maximum_price"
        | "unit_price"
        | "design_build"
        | "master_service_agreement"
        | "subcontractor_agreement"
        | "change_order"
        | "amendment"
        | "addendum"
        | "maintenance_agreement"
        | "service_agreement"
        | "warranty_agreement"
        | "nda"
        | "independent_contractor_agreement"
        | "joint_venture"
        | "partnership"
        | "consulting_agreement"
        | "letter_of_intent"
        | "purchase_order"
        | "other"
      crew_role:
        | "lead"
        | "foreman"
        | "journeyman"
        | "apprentice"
        | "helper"
        | "laborer"
        | "specialist"
        | "supervisor"
      currency_code: "USD" | "CAD" | "MXN" | "EUR" | "GBP" | "AUD" | "NZD"
      day_of_week:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
      document_status:
        | "draft"
        | "active"
        | "archived"
        | "deleted"
        | "pending_review"
        | "approved"
        | "rejected"
        | "expired"
      document_type:
        | "contract"
        | "proposal"
        | "estimate"
        | "invoice"
        | "receipt"
        | "change_order"
        | "lien_waiver"
        | "warranty"
        | "permit"
        | "inspection_report"
        | "certificate"
        | "blueprint"
        | "floor_plan"
        | "site_plan"
        | "survey"
        | "engineering_report"
        | "soil_report"
        | "environmental_report"
        | "specification"
        | "material_list"
        | "cut_sheet"
        | "photo"
        | "video"
        | "drone_footage"
        | "insurance_certificate"
        | "license"
        | "bond"
        | "w9"
        | "1099"
        | "w2"
        | "tax_document"
        | "safety_plan"
        | "msds_sds"
        | "osha_report"
        | "meeting_notes"
        | "daily_log"
        | "punch_list"
        | "as_built"
        | "closeout_document"
        | "client_correspondence"
        | "internal_memo"
        | "marketing_material"
        | "brochure"
        | "training_material"
        | "manual"
        | "template"
        | "form"
        | "checklist"
        | "other"
      draw_schedule_status:
        | "pending"
        | "submitted"
        | "approved"
        | "paid"
        | "rejected"
        | "revised"
        | "voided"
      employment_status:
        | "active"
        | "on_leave"
        | "on_vacation"
        | "suspended"
        | "terminated"
        | "resigned"
        | "retired"
        | "laid_off"
        | "probation"
        | "inactive"
        | "deceased"
      employment_type:
        | "full_time_w2"
        | "part_time_w2"
        | "seasonal_w2"
        | "independent_contractor_1099"
        | "subcontractor_company"
        | "temporary"
        | "intern"
        | "apprentice"
        | "day_labor"
        | "per_diem"
        | "on_call"
      equipment_condition:
        | "new"
        | "excellent"
        | "good"
        | "fair"
        | "needs_repair"
        | "out_of_service"
        | "retired"
        | "disposed"
      equipment_ownership:
        | "owned"
        | "leased"
        | "rented"
        | "borrowed"
        | "client_provided"
      equipment_type:
        | "excavator"
        | "backhoe"
        | "skid_steer"
        | "loader"
        | "bulldozer"
        | "crane"
        | "forklift"
        | "boom_lift"
        | "scissor_lift"
        | "scaffolding"
        | "ladder"
        | "generator"
        | "compressor"
        | "welder"
        | "concrete_mixer"
        | "concrete_pump"
        | "concrete_saw"
        | "table_saw"
        | "miter_saw"
        | "circular_saw"
        | "band_saw"
        | "drill_press"
        | "impact_driver"
        | "hammer_drill"
        | "nail_gun"
        | "staple_gun"
        | "spray_gun"
        | "sander"
        | "grinder"
        | "router"
        | "planer"
        | "pressure_washer"
        | "paint_sprayer"
        | "trencher"
        | "plate_compactor"
        | "roller"
        | "dumpster"
        | "portable_toilet"
        | "heater"
        | "fan"
        | "dehumidifier"
        | "laser_level"
        | "total_station"
        | "drone"
        | "camera"
        | "thermal_camera"
        | "safety_equipment"
        | "ppe"
        | "hand_tool_set"
        | "power_tool_set"
        | "other"
      estimate_line_item_type:
        | "labor"
        | "material"
        | "equipment_rental"
        | "equipment_owned"
        | "subcontractor"
        | "permit_fee"
        | "inspection_fee"
        | "design_fee"
        | "engineering_fee"
        | "consulting_fee"
        | "delivery"
        | "disposal"
        | "dumpster"
        | "overhead"
        | "profit_margin"
        | "contingency"
        | "tax"
        | "discount"
        | "credit"
        | "allowance"
        | "warranty"
        | "bond"
        | "insurance"
        | "travel"
        | "fuel"
        | "parking"
        | "storage"
        | "temporary_facilities"
        | "cleanup"
        | "protection"
        | "other"
      estimate_status:
        | "draft"
        | "pending_review"
        | "approved_internal"
        | "sent"
        | "viewed"
        | "accepted"
        | "declined"
        | "expired"
        | "revised"
        | "countered"
        | "archived"
      expense_category:
        | "materials_lumber"
        | "materials_concrete"
        | "materials_steel"
        | "materials_drywall"
        | "materials_insulation"
        | "materials_roofing"
        | "materials_siding"
        | "materials_flooring"
        | "materials_tile"
        | "materials_paint"
        | "materials_hardware"
        | "materials_fasteners"
        | "materials_electrical"
        | "materials_plumbing"
        | "materials_hvac"
        | "materials_cabinets"
        | "materials_countertops"
        | "materials_appliances"
        | "materials_windows"
        | "materials_doors"
        | "materials_trim"
        | "materials_adhesive_sealant"
        | "materials_landscape"
        | "materials_masonry"
        | "materials_other"
        | "equipment_rental"
        | "equipment_purchase"
        | "equipment_maintenance"
        | "equipment_fuel"
        | "equipment_repair"
        | "vehicle_fuel"
        | "vehicle_maintenance"
        | "vehicle_insurance"
        | "vehicle_lease"
        | "vehicle_purchase"
        | "vehicle_registration"
        | "vehicle_tolls"
        | "vehicle_parking"
        | "labor_wages"
        | "labor_overtime"
        | "labor_bonus"
        | "labor_payroll_tax"
        | "labor_workers_comp"
        | "labor_benefits"
        | "labor_training"
        | "labor_certification"
        | "subcontractor_payment"
        | "subcontractor_materials"
        | "office_rent"
        | "office_utilities"
        | "office_supplies"
        | "office_equipment"
        | "office_software"
        | "office_phone"
        | "office_internet"
        | "office_postage"
        | "insurance_general_liability"
        | "insurance_professional"
        | "insurance_workers_comp"
        | "insurance_auto"
        | "insurance_property"
        | "insurance_umbrella"
        | "insurance_bond"
        | "insurance_builders_risk"
        | "professional_accounting"
        | "professional_legal"
        | "professional_engineering"
        | "professional_architecture"
        | "professional_design"
        | "professional_consulting"
        | "marketing_advertising"
        | "marketing_website"
        | "marketing_print"
        | "marketing_signage"
        | "marketing_sponsorship"
        | "marketing_networking"
        | "fee_permit"
        | "fee_inspection"
        | "fee_license"
        | "fee_bank"
        | "fee_credit_card_processing"
        | "fee_software_subscription"
        | "fee_association_dues"
        | "disposal_dumpster"
        | "disposal_hazmat"
        | "disposal_recycling"
        | "disposal_dump_fees"
        | "travel_mileage"
        | "travel_meals"
        | "travel_lodging"
        | "travel_airfare"
        | "travel_parking"
        | "taxes"
        | "interest"
        | "depreciation"
        | "miscellaneous"
        | "other"
      expense_status:
        | "pending"
        | "approved"
        | "rejected"
        | "reimbursed"
        | "paid"
        | "voided"
        | "archived"
      feature_flag_status: "enabled" | "disabled" | "beta" | "deprecated"
      incident_severity: "minor" | "moderate" | "serious" | "critical" | "fatal"
      incident_status:
        | "reported"
        | "under_investigation"
        | "resolved"
        | "closed"
        | "escalated"
        | "osha_notified"
        | "insurance_claimed"
        | "legal_action"
      incident_type:
        | "injury_minor"
        | "injury_major"
        | "injury_fatal"
        | "near_miss"
        | "property_damage"
        | "vehicle_accident"
        | "equipment_failure"
        | "fire"
        | "electrical"
        | "fall"
        | "struck_by"
        | "caught_in"
        | "chemical_exposure"
        | "environmental_spill"
        | "theft"
        | "vandalism"
        | "trespassing"
        | "client_complaint"
        | "neighbor_complaint"
        | "code_violation"
        | "osha_violation"
        | "weather_damage"
        | "other"
      inspection_status:
        | "not_scheduled"
        | "scheduled"
        | "in_progress"
        | "passed"
        | "failed"
        | "partial"
        | "conditional"
        | "reinspection_required"
        | "cancelled"
        | "no_show"
      inspection_type:
        | "footing"
        | "foundation"
        | "slab"
        | "underground_plumbing"
        | "underground_electrical"
        | "rough_framing"
        | "rough_electrical"
        | "rough_plumbing"
        | "rough_mechanical"
        | "rough_hvac"
        | "insulation"
        | "vapor_barrier"
        | "drywall_nail"
        | "fire_blocking"
        | "fire_sprinkler"
        | "fire_alarm"
        | "roofing"
        | "waterproofing"
        | "structural"
        | "energy_compliance"
        | "accessibility"
        | "final_building"
        | "final_electrical"
        | "final_plumbing"
        | "final_mechanical"
        | "final_fire"
        | "certificate_of_occupancy"
        | "certificate_of_completion"
        | "pre_pour"
        | "post_tension"
        | "special_inspection"
        | "soil_compaction"
        | "concrete_testing"
        | "pool"
        | "fence"
        | "deck"
        | "retaining_wall"
        | "gas_line"
        | "sewer"
        | "water_line"
        | "backflow"
        | "grease_trap"
        | "other"
      inventory_status:
        | "in_stock"
        | "low_stock"
        | "out_of_stock"
        | "on_order"
        | "backordered"
        | "discontinued"
        | "reserved"
        | "allocated"
        | "in_transit"
        | "returned"
        | "damaged"
        | "expired"
      invitation_status:
        | "pending"
        | "accepted"
        | "expired"
        | "revoked"
        | "bounced"
      invoice_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "sent"
        | "viewed"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "disputed"
        | "voided"
        | "write_off"
        | "refunded"
        | "archived"
      invoice_type:
        | "standard"
        | "progress"
        | "draw_request"
        | "retainage_release"
        | "final"
        | "change_order"
        | "credit_memo"
        | "debit_memo"
        | "recurring"
        | "deposit"
        | "prepayment"
        | "time_and_materials"
        | "cost_plus"
        | "maintenance"
        | "warranty"
        | "service_call"
        | "other"
      lead_priority: "urgent" | "high" | "medium" | "low"
      lead_source:
        | "website_form"
        | "website_booking"
        | "website_chat"
        | "phone_call"
        | "walk_in"
        | "referral_client"
        | "referral_partner"
        | "google_ads"
        | "facebook_ads"
        | "instagram_ads"
        | "nextdoor"
        | "homeadvisor"
        | "angies_list"
        | "thumbtack"
        | "houzz"
        | "yelp"
        | "google_maps"
        | "google_organic"
        | "social_media"
        | "email_campaign"
        | "direct_mail"
        | "door_hanger"
        | "yard_sign"
        | "trade_show"
        | "home_show"
        | "networking"
        | "repeat_client"
        | "property_manager"
        | "realtor"
        | "insurance_claim"
        | "warranty_claim"
        | "manual_entry"
        | "import"
        | "api"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "needs_analysis"
        | "estimate_scheduled"
        | "estimate_sent"
        | "proposal_sent"
        | "negotiating"
        | "won"
        | "lost"
        | "disqualified"
        | "on_hold"
        | "nurturing"
        | "reactivated"
        | "no_response"
        | "archived"
      lead_temperature: "hot" | "warm" | "cool" | "cold" | "dead"
      lien_waiver_status:
        | "draft"
        | "requested"
        | "received"
        | "approved"
        | "rejected"
        | "expired"
        | "archived"
      lien_waiver_type:
        | "conditional_progress"
        | "unconditional_progress"
        | "conditional_final"
        | "unconditional_final"
      maintenance_type:
        | "preventive"
        | "corrective"
        | "emergency"
        | "inspection"
        | "calibration"
        | "cleaning"
        | "oil_change"
        | "tire"
        | "brake"
        | "fluid"
        | "filter"
        | "battery"
        | "belt"
        | "other"
      material_unit:
        | "each"
        | "pair"
        | "set"
        | "box"
        | "case"
        | "pallet"
        | "linear_foot"
        | "square_foot"
        | "cubic_foot"
        | "linear_yard"
        | "square_yard"
        | "cubic_yard"
        | "linear_meter"
        | "square_meter"
        | "cubic_meter"
        | "inch"
        | "foot"
        | "yard"
        | "meter"
        | "ounce"
        | "pound"
        | "ton"
        | "gram"
        | "kilogram"
        | "gallon"
        | "quart"
        | "pint"
        | "liter"
        | "bag"
        | "bundle"
        | "roll"
        | "sheet"
        | "board"
        | "piece"
        | "length"
        | "slab"
        | "block"
        | "brick"
        | "truckload"
        | "half_truckload"
        | "hour"
        | "day"
        | "week"
        | "month"
        | "lump_sum"
        | "allowance"
        | "other"
      message_channel:
        | "in_app"
        | "email"
        | "sms"
        | "phone_call"
        | "video_call"
        | "push_notification"
        | "webhook"
        | "slack"
        | "other"
      message_direction: "inbound" | "outbound" | "internal" | "system"
      message_status:
        | "draft"
        | "queued"
        | "sent"
        | "delivered"
        | "read"
        | "failed"
        | "bounced"
        | "spam"
        | "unsubscribed"
        | "archived"
      notification_priority: "critical" | "high" | "normal" | "low"
      notification_type:
        | "lead_new"
        | "lead_assigned"
        | "lead_status_change"
        | "project_created"
        | "project_status_change"
        | "project_phase_complete"
        | "task_assigned"
        | "task_due"
        | "task_overdue"
        | "task_completed"
        | "estimate_sent"
        | "estimate_viewed"
        | "estimate_accepted"
        | "estimate_declined"
        | "proposal_sent"
        | "proposal_viewed"
        | "proposal_accepted"
        | "proposal_declined"
        | "contract_sent"
        | "contract_signed"
        | "contract_expired"
        | "change_order_requested"
        | "change_order_approved"
        | "change_order_declined"
        | "invoice_sent"
        | "invoice_viewed"
        | "invoice_paid"
        | "invoice_overdue"
        | "payment_received"
        | "payment_failed"
        | "payment_refunded"
        | "message_received"
        | "message_reply"
        | "appointment_scheduled"
        | "appointment_reminder"
        | "appointment_cancelled"
        | "inspection_scheduled"
        | "inspection_passed"
        | "inspection_failed"
        | "permit_approved"
        | "permit_expired"
        | "document_uploaded"
        | "document_signed"
        | "review_received"
        | "review_requested"
        | "employee_clocked_in"
        | "employee_clocked_out"
        | "timesheet_submitted"
        | "timesheet_approved"
        | "certification_expiring"
        | "certification_expired"
        | "warranty_expiring"
        | "maintenance_due"
        | "weather_alert"
        | "system_alert"
        | "ai_generation_complete"
        | "ai_suggestion"
        | "custom"
      page_status: "draft" | "published" | "unpublished" | "archived"
      page_type:
        | "home"
        | "about"
        | "services"
        | "service_detail"
        | "portfolio"
        | "portfolio_detail"
        | "reviews"
        | "contact"
        | "booking"
        | "faq"
        | "blog"
        | "blog_post"
        | "team"
        | "careers"
        | "privacy_policy"
        | "terms_of_service"
        | "sitemap"
        | "custom"
        | "landing_page"
      pay_frequency:
        | "weekly"
        | "biweekly"
        | "semimonthly"
        | "monthly"
        | "per_project"
        | "on_completion"
        | "daily"
      pay_type:
        | "hourly"
        | "salary"
        | "per_project"
        | "per_task"
        | "piece_rate"
        | "commission"
        | "day_rate"
        | "weekly_flat"
        | "biweekly_flat"
        | "monthly_flat"
      payment_method:
        | "credit_card"
        | "debit_card"
        | "ach_bank_transfer"
        | "wire_transfer"
        | "check"
        | "cash"
        | "money_order"
        | "cashiers_check"
        | "zelle"
        | "venmo"
        | "paypal"
        | "apple_pay"
        | "google_pay"
        | "financing"
        | "construction_loan_draw"
        | "insurance_payment"
        | "barter"
        | "trade"
        | "other"
      payment_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "refunded"
        | "partially_refunded"
        | "disputed"
        | "chargeback"
        | "held"
        | "released"
      permit_status:
        | "not_required"
        | "research_needed"
        | "application_pending"
        | "application_submitted"
        | "under_review"
        | "revisions_required"
        | "approved"
        | "issued"
        | "active"
        | "expired"
        | "final_approved"
        | "denied"
        | "cancelled"
        | "archived"
      permit_type:
        | "building"
        | "electrical"
        | "plumbing"
        | "mechanical"
        | "hvac"
        | "demolition"
        | "grading"
        | "excavation"
        | "foundation"
        | "roofing"
        | "siding"
        | "fence"
        | "deck"
        | "pool"
        | "spa"
        | "solar"
        | "generator"
        | "fire_alarm"
        | "sprinkler"
        | "sign"
        | "driveway"
        | "sidewalk"
        | "curb_cut"
        | "tree_removal"
        | "environmental"
        | "stormwater"
        | "septic"
        | "well"
        | "zoning_variance"
        | "conditional_use"
        | "historic_review"
        | "hoa_approval"
        | "occupancy"
        | "temporary_power"
        | "road_closure"
        | "noise_variance"
        | "other"
      project_complexity:
        | "simple"
        | "moderate"
        | "complex"
        | "highly_complex"
        | "custom"
      project_phase_status:
        | "not_started"
        | "in_progress"
        | "paused"
        | "blocked"
        | "review"
        | "completed"
        | "skipped"
      project_priority:
        | "emergency"
        | "urgent"
        | "high"
        | "normal"
        | "low"
        | "scheduled"
      project_status:
        | "inquiry"
        | "estimate_pending"
        | "estimate_scheduled"
        | "estimate_sent"
        | "proposal_sent"
        | "proposal_accepted"
        | "contract_pending"
        | "contract_signed"
        | "pre_construction"
        | "permitting"
        | "permit_approved"
        | "material_ordering"
        | "materials_received"
        | "scheduled"
        | "in_progress"
        | "on_hold_client"
        | "on_hold_weather"
        | "on_hold_materials"
        | "on_hold_permits"
        | "on_hold_subcontractor"
        | "on_hold_payment"
        | "on_hold_change_order"
        | "on_hold_inspection"
        | "on_hold_other"
        | "punch_list"
        | "final_inspection"
        | "final_walkthrough"
        | "completed"
        | "closed"
        | "warranty_active"
        | "warranty_expired"
        | "cancelled"
        | "abandoned"
        | "disputed"
        | "archived"
      project_type:
        | "repair"
        | "maintenance"
        | "installation"
        | "replacement"
        | "remodel"
        | "renovation"
        | "addition"
        | "new_build"
        | "restoration"
        | "emergency"
        | "inspection"
        | "consultation"
        | "design"
        | "engineering"
        | "warranty_work"
        | "callback"
        | "punch_list_item"
        | "recurring_maintenance"
        | "seasonal"
        | "insurance_claim"
        | "other"
      property_age_range:
        | "new_construction"
        | "0_5_years"
        | "5_10_years"
        | "10_20_years"
        | "20_50_years"
        | "50_100_years"
        | "over_100_years"
        | "unknown"
      property_type:
        | "single_family"
        | "multi_family"
        | "townhouse"
        | "condo"
        | "co_op"
        | "manufactured_home"
        | "mobile_home"
        | "modular_home"
        | "tiny_home"
        | "apartment"
        | "duplex"
        | "triplex"
        | "fourplex"
        | "commercial_office"
        | "commercial_retail"
        | "commercial_restaurant"
        | "commercial_warehouse"
        | "commercial_industrial"
        | "commercial_medical"
        | "mixed_use"
        | "vacant_land"
        | "farm_ranch"
        | "church"
        | "school"
        | "government_building"
        | "hoa_common_area"
        | "other"
      proposal_status:
        | "draft"
        | "internal_review"
        | "sent"
        | "viewed"
        | "accepted"
        | "declined"
        | "expired"
        | "revised"
        | "countered"
        | "archived"
      proposal_tier: "economy" | "standard" | "premium" | "luxury" | "custom"
      recurrence_pattern:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "annual"
        | "custom"
        | "none"
      relationship_type:
        | "primary"
        | "spouse_partner"
        | "property_manager"
        | "tenant"
        | "assistant"
        | "decision_maker"
        | "billing_contact"
        | "emergency_contact"
        | "other"
      retainage_status:
        | "withheld"
        | "partially_released"
        | "released"
        | "disputed"
      review_source:
        | "google"
        | "yelp"
        | "facebook"
        | "homeadvisor"
        | "angies_list"
        | "bbb"
        | "houzz"
        | "nextdoor"
        | "thumbtack"
        | "internal"
        | "testimonial"
        | "other"
      review_status:
        | "pending_approval"
        | "published"
        | "hidden"
        | "flagged"
        | "responded"
        | "archived"
      schedule_event_type:
        | "job_work"
        | "site_visit"
        | "estimate_appointment"
        | "consultation"
        | "inspection"
        | "delivery"
        | "permit_pickup"
        | "client_meeting"
        | "team_meeting"
        | "training"
        | "maintenance"
        | "travel"
        | "office_hours"
        | "personal"
        | "holiday"
        | "weather_day"
        | "emergency"
        | "callback"
        | "warranty_visit"
        | "final_walkthrough"
        | "photo_documentation"
        | "other"
      schedule_status:
        | "tentative"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
        | "no_show"
        | "weather_cancelled"
      service_difficulty: "simple" | "moderate" | "complex" | "expert_only"
      service_pricing_model:
        | "fixed_price"
        | "per_square_foot"
        | "per_linear_foot"
        | "per_unit"
        | "hourly"
        | "daily"
        | "per_room"
        | "per_fixture"
        | "tiered"
        | "cost_plus_percentage"
        | "cost_plus_fixed"
        | "time_and_materials"
        | "not_to_exceed"
        | "subscription_monthly"
        | "subscription_annual"
        | "free_estimate"
        | "call_for_pricing"
        | "custom_quote"
      tag_entity_type:
        | "lead"
        | "client"
        | "project"
        | "estimate"
        | "proposal"
        | "contract"
        | "invoice"
        | "document"
        | "employee"
        | "subcontractor"
        | "vendor"
        | "property"
        | "service"
        | "material"
        | "equipment"
        | "vehicle"
        | "note"
        | "task"
        | "message"
        | "other"
      task_priority: "critical" | "high" | "medium" | "low" | "optional"
      task_status:
        | "backlog"
        | "todo"
        | "in_progress"
        | "in_review"
        | "blocked"
        | "completed"
        | "cancelled"
        | "deferred"
      tax_type:
        | "sales_tax"
        | "use_tax"
        | "material_tax"
        | "labor_tax"
        | "combined"
        | "exempt"
        | "other"
      tenant_plan:
        | "trial"
        | "starter"
        | "professional"
        | "business"
        | "enterprise"
        | "custom"
        | "lifetime"
        | "free"
      tenant_status:
        | "trial"
        | "active"
        | "paused"
        | "suspended"
        | "cancelled"
        | "churned"
        | "onboarding"
        | "pending_payment"
        | "archived"
      time_entry_status:
        | "clocked_in"
        | "clocked_out"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "adjusted"
        | "locked"
        | "paid"
      time_entry_type:
        | "regular"
        | "overtime"
        | "double_time"
        | "travel"
        | "break_paid"
        | "break_unpaid"
        | "training"
        | "meeting"
        | "administrative"
        | "pto"
        | "sick"
        | "holiday"
        | "bereavement"
        | "jury_duty"
        | "military"
        | "workers_comp"
        | "on_call"
        | "standby"
        | "weather_delay"
        | "other"
      trade_category:
        | "general_contracting"
        | "handyman"
        | "remodeling"
        | "renovation"
        | "new_construction"
        | "custom_home_building"
        | "additions"
        | "electrical"
        | "plumbing"
        | "hvac"
        | "roofing"
        | "siding"
        | "gutters"
        | "windows_doors"
        | "painting_interior"
        | "painting_exterior"
        | "staining"
        | "drywall"
        | "plastering"
        | "texture"
        | "flooring_hardwood"
        | "flooring_tile"
        | "flooring_carpet"
        | "flooring_vinyl"
        | "flooring_laminate"
        | "flooring_epoxy"
        | "carpentry_rough"
        | "carpentry_finish"
        | "carpentry_trim"
        | "cabinetry"
        | "countertops"
        | "closet_systems"
        | "concrete"
        | "masonry"
        | "foundation"
        | "framing"
        | "structural"
        | "insulation"
        | "weatherization"
        | "demolition"
        | "excavation"
        | "grading"
        | "landscaping"
        | "hardscaping"
        | "irrigation"
        | "fencing"
        | "decking"
        | "patio"
        | "pergola"
        | "gazebo"
        | "pool_construction"
        | "pool_maintenance"
        | "garage_doors"
        | "garage_conversion"
        | "basement_finishing"
        | "basement_waterproofing"
        | "attic_conversion"
        | "attic_insulation"
        | "kitchen_remodel"
        | "bathroom_remodel"
        | "home_theater"
        | "home_automation"
        | "smart_home"
        | "security_systems"
        | "camera_installation"
        | "solar_installation"
        | "ev_charger"
        | "septic"
        | "well_drilling"
        | "water_treatment"
        | "fire_damage_restoration"
        | "water_damage_restoration"
        | "mold_remediation"
        | "asbestos_abatement"
        | "lead_paint"
        | "accessibility_modifications"
        | "aging_in_place"
        | "cleaning_post_construction"
        | "cleaning_residential"
        | "pest_control"
        | "chimney"
        | "fireplace"
        | "appliance_installation"
        | "appliance_repair"
        | "pressure_washing"
        | "window_cleaning"
        | "tree_service"
        | "snow_removal"
        | "lawn_care"
        | "junk_removal"
        | "dumpster_rental"
        | "moving_services"
        | "storage"
        | "inspection"
        | "consulting"
        | "project_management"
        | "other"
      user_role:
        | "platform_superadmin"
        | "platform_admin"
        | "platform_support"
        | "tenant_owner"
        | "tenant_admin"
        | "tenant_manager"
        | "project_manager"
        | "estimator"
        | "foreman"
        | "field_worker"
        | "office_staff"
        | "bookkeeper"
        | "accountant"
        | "subcontractor"
        | "vendor"
        | "client"
        | "client_property_manager"
        | "readonly"
        | "api_service_account"
      user_status:
        | "active"
        | "inactive"
        | "invited"
        | "pending_verification"
        | "suspended"
        | "deactivated"
        | "locked"
        | "archived"
      vehicle_type:
        | "pickup_truck"
        | "cargo_van"
        | "box_truck"
        | "flatbed"
        | "dump_truck"
        | "trailer"
        | "enclosed_trailer"
        | "utility_trailer"
        | "car"
        | "suv"
        | "atv"
        | "other"
      warranty_claim_status:
        | "submitted"
        | "under_review"
        | "approved"
        | "denied"
        | "in_progress"
        | "completed"
        | "escalated"
        | "closed"
      warranty_status:
        | "active"
        | "expiring_soon"
        | "expired"
        | "claimed"
        | "claim_approved"
        | "claim_denied"
        | "voided"
        | "transferred"
      warranty_type:
        | "workmanship"
        | "material_manufacturer"
        | "material_supplier"
        | "extended"
        | "limited"
        | "full"
        | "implied"
        | "structural"
        | "systems"
        | "appliance"
        | "roof"
        | "paint"
        | "flooring"
        | "hvac"
        | "plumbing"
        | "electrical"
        | "maintenance_agreement"
        | "service_contract"
        | "other"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      ab_test_status: ["draft", "running", "paused", "completed", "cancelled"],
      activity_action: [
        "created",
        "updated",
        "deleted",
        "restored",
        "viewed",
        "downloaded",
        "printed",
        "shared",
        "exported",
        "sent",
        "received",
        "opened",
        "clicked",
        "signed",
        "approved",
        "rejected",
        "revoked",
        "assigned",
        "unassigned",
        "reassigned",
        "started",
        "paused",
        "resumed",
        "completed",
        "cancelled",
        "clocked_in",
        "clocked_out",
        "paid",
        "refunded",
        "voided",
        "commented",
        "mentioned",
        "tagged",
        "uploaded",
        "archived",
        "unarchived",
        "merged",
        "split",
        "duplicated",
        "converted",
        "imported",
        "synced",
        "logged_in",
        "logged_out",
        "password_changed",
        "setting_changed",
        "role_changed",
        "ai_generated",
        "ai_edited",
        "status_changed",
        "priority_changed",
        "other",
      ],
      activity_entity_type: [
        "lead",
        "client",
        "contact",
        "property",
        "project",
        "task",
        "phase",
        "estimate",
        "proposal",
        "contract",
        "change_order",
        "lien_waiver",
        "invoice",
        "payment",
        "expense",
        "employee",
        "subcontractor",
        "vendor",
        "time_entry",
        "schedule_event",
        "document",
        "message",
        "notification",
        "permit",
        "inspection",
        "warranty",
        "warranty_claim",
        "review",
        "vehicle",
        "equipment",
        "ai_generation",
        "setting",
        "user",
        "tenant",
        "other",
      ],
      ai_feedback: [
        "thumbs_up",
        "thumbs_down",
        "edited_and_used",
        "used_as_is",
        "discarded",
        "regenerated",
        "no_feedback",
      ],
      ai_generation_type: [
        "scope_of_work",
        "contract_draft",
        "estimate",
        "proposal",
        "email_draft",
        "sms_draft",
        "change_order_analysis",
        "photo_analysis",
        "schedule_optimization",
        "financial_analysis",
        "client_communication",
        "project_summary",
        "meeting_notes",
        "daily_log_summary",
        "material_list",
        "punch_list",
        "safety_plan",
        "risk_assessment",
        "warranty_document",
        "maintenance_plan",
        "marketing_content",
        "social_media_post",
        "job_description",
        "review_response",
        "faq_answer",
        "chatbot_response",
        "data_extraction",
        "document_summary",
        "translation",
        "custom",
      ],
      ai_module: [
        "scope_generator",
        "contract_drafter",
        "estimate_builder",
        "proposal_writer",
        "email_composer",
        "sms_composer",
        "change_order_analyzer",
        "photo_analyzer",
        "schedule_optimizer",
        "financial_analyst",
        "client_communicator",
        "project_summarizer",
        "daily_log_writer",
        "material_estimator",
        "punch_list_generator",
        "safety_planner",
        "risk_assessor",
        "warranty_writer",
        "maintenance_planner",
        "marketing_writer",
        "social_media_writer",
        "review_responder",
        "faq_generator",
        "chatbot",
        "data_extractor",
        "document_summarizer",
        "translator",
        "booking_assistant",
        "search",
        "general",
      ],
      ai_provider: [
        "anthropic",
        "openai",
        "google",
        "mistral",
        "meta",
        "cohere",
        "perplexity",
        "groq",
        "together",
        "aws_bedrock",
        "azure_openai",
        "vertex_ai",
        "local",
        "custom",
      ],
      ai_routing_strategy: [
        "primary_only",
        "fallback",
        "ab_test",
        "round_robin",
        "cost_optimized",
        "latency_optimized",
        "quality_optimized",
        "manual",
      ],
      auth_provider: [
        "email",
        "google",
        "apple",
        "microsoft",
        "phone",
        "magic_link",
        "sso",
      ],
      certification_status: [
        "active",
        "expired",
        "pending_renewal",
        "suspended",
        "revoked",
        "not_applicable",
        "in_progress",
      ],
      certification_type: [
        "general_contractor_license",
        "specialty_contractor_license",
        "electrical_license",
        "plumbing_license",
        "hvac_license",
        "gas_fitter_license",
        "fire_protection_license",
        "asbestos_certification",
        "lead_paint_certification",
        "mold_certification",
        "radon_certification",
        "epa_certification",
        "osha_10",
        "osha_30",
        "first_aid_cpr",
        "confined_space",
        "fall_protection",
        "scaffolding",
        "forklift_operator",
        "crane_operator",
        "cdl_class_a",
        "cdl_class_b",
        "welding_certification",
        "brazing_certification",
        "backflow_preventer",
        "fire_alarm",
        "low_voltage",
        "structured_cabling",
        "pool_contractor",
        "irrigation",
        "pesticide_applicator",
        "arborist",
        "home_inspector",
        "energy_auditor",
        "leed_certification",
        "nahb_certification",
        "nari_certification",
        "epa_renovation",
        "bonded",
        "insured",
        "drug_test",
        "background_check",
        "safety_training",
        "equipment_operation",
        "manufacturer_certified",
        "other",
      ],
      change_order_reason: [
        "client_request",
        "unforeseen_condition",
        "design_error",
        "design_change",
        "code_requirement",
        "material_substitution",
        "material_unavailable",
        "scope_clarification",
        "value_engineering",
        "site_condition",
        "weather_damage",
        "structural_issue",
        "inspection_requirement",
        "permit_requirement",
        "safety_concern",
        "schedule_acceleration",
        "owner_furnished_item_change",
        "subcontractor_issue",
        "price_escalation",
        "other",
      ],
      change_order_status: [
        "draft",
        "pending_approval_internal",
        "pending_approval_client",
        "approved",
        "declined",
        "revised",
        "voided",
        "in_progress",
        "completed",
        "disputed",
        "archived",
      ],
      client_type: [
        "residential_homeowner",
        "residential_renter",
        "residential_landlord",
        "commercial_owner",
        "commercial_tenant",
        "commercial_manager",
        "property_management_company",
        "real_estate_agent",
        "real_estate_investor",
        "hoa",
        "condo_association",
        "government",
        "nonprofit",
        "religious_organization",
        "insurance_company",
        "warranty_company",
        "general_contractor",
        "developer",
        "builder",
        "other",
      ],
      contact_method_preference: [
        "phone_call",
        "text_sms",
        "email",
        "in_app",
        "no_preference",
      ],
      content_block_type: [
        "hero",
        "text",
        "image",
        "video",
        "gallery",
        "cta",
        "testimonial",
        "faq",
        "form",
        "service_cards",
        "team_members",
        "stats",
        "before_after",
        "map",
        "pricing_table",
        "contact_info",
        "social_links",
        "html_embed",
        "divider",
        "spacer",
        "columns",
        "accordion",
        "tabs",
        "timeline",
        "process_steps",
        "logo_cloud",
        "feature_grid",
        "custom",
      ],
      contract_clause_type: [
        "scope_of_work",
        "payment_terms",
        "schedule",
        "change_order_process",
        "warranty",
        "liability",
        "indemnification",
        "insurance_requirements",
        "dispute_resolution",
        "termination",
        "force_majeure",
        "safety_requirements",
        "cleanup",
        "permits_licenses",
        "material_specifications",
        "workmanship_standards",
        "inspection_rights",
        "lien_waiver",
        "retainage",
        "liquidated_damages",
        "bonus_incentive",
        "confidentiality",
        "non_compete",
        "non_solicitation",
        "assignment",
        "subcontracting",
        "governing_law",
        "notice_requirements",
        "entire_agreement",
        "severability",
        "amendment_process",
        "site_access",
        "working_hours",
        "noise_restrictions",
        "environmental_compliance",
        "hazardous_materials",
        "owner_responsibilities",
        "custom",
      ],
      contract_status: [
        "draft",
        "pending_review",
        "pending_signature_contractor",
        "pending_signature_client",
        "partially_signed",
        "fully_executed",
        "active",
        "amended",
        "on_hold",
        "breached",
        "terminated",
        "completed",
        "expired",
        "voided",
        "disputed",
        "archived",
      ],
      contract_type: [
        "fixed_price",
        "cost_plus_fixed_fee",
        "cost_plus_percentage",
        "time_and_materials",
        "guaranteed_maximum_price",
        "unit_price",
        "design_build",
        "master_service_agreement",
        "subcontractor_agreement",
        "change_order",
        "amendment",
        "addendum",
        "maintenance_agreement",
        "service_agreement",
        "warranty_agreement",
        "nda",
        "independent_contractor_agreement",
        "joint_venture",
        "partnership",
        "consulting_agreement",
        "letter_of_intent",
        "purchase_order",
        "other",
      ],
      crew_role: [
        "lead",
        "foreman",
        "journeyman",
        "apprentice",
        "helper",
        "laborer",
        "specialist",
        "supervisor",
      ],
      currency_code: ["USD", "CAD", "MXN", "EUR", "GBP", "AUD", "NZD"],
      day_of_week: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      document_status: [
        "draft",
        "active",
        "archived",
        "deleted",
        "pending_review",
        "approved",
        "rejected",
        "expired",
      ],
      document_type: [
        "contract",
        "proposal",
        "estimate",
        "invoice",
        "receipt",
        "change_order",
        "lien_waiver",
        "warranty",
        "permit",
        "inspection_report",
        "certificate",
        "blueprint",
        "floor_plan",
        "site_plan",
        "survey",
        "engineering_report",
        "soil_report",
        "environmental_report",
        "specification",
        "material_list",
        "cut_sheet",
        "photo",
        "video",
        "drone_footage",
        "insurance_certificate",
        "license",
        "bond",
        "w9",
        "1099",
        "w2",
        "tax_document",
        "safety_plan",
        "msds_sds",
        "osha_report",
        "meeting_notes",
        "daily_log",
        "punch_list",
        "as_built",
        "closeout_document",
        "client_correspondence",
        "internal_memo",
        "marketing_material",
        "brochure",
        "training_material",
        "manual",
        "template",
        "form",
        "checklist",
        "other",
      ],
      draw_schedule_status: [
        "pending",
        "submitted",
        "approved",
        "paid",
        "rejected",
        "revised",
        "voided",
      ],
      employment_status: [
        "active",
        "on_leave",
        "on_vacation",
        "suspended",
        "terminated",
        "resigned",
        "retired",
        "laid_off",
        "probation",
        "inactive",
        "deceased",
      ],
      employment_type: [
        "full_time_w2",
        "part_time_w2",
        "seasonal_w2",
        "independent_contractor_1099",
        "subcontractor_company",
        "temporary",
        "intern",
        "apprentice",
        "day_labor",
        "per_diem",
        "on_call",
      ],
      equipment_condition: [
        "new",
        "excellent",
        "good",
        "fair",
        "needs_repair",
        "out_of_service",
        "retired",
        "disposed",
      ],
      equipment_ownership: [
        "owned",
        "leased",
        "rented",
        "borrowed",
        "client_provided",
      ],
      equipment_type: [
        "excavator",
        "backhoe",
        "skid_steer",
        "loader",
        "bulldozer",
        "crane",
        "forklift",
        "boom_lift",
        "scissor_lift",
        "scaffolding",
        "ladder",
        "generator",
        "compressor",
        "welder",
        "concrete_mixer",
        "concrete_pump",
        "concrete_saw",
        "table_saw",
        "miter_saw",
        "circular_saw",
        "band_saw",
        "drill_press",
        "impact_driver",
        "hammer_drill",
        "nail_gun",
        "staple_gun",
        "spray_gun",
        "sander",
        "grinder",
        "router",
        "planer",
        "pressure_washer",
        "paint_sprayer",
        "trencher",
        "plate_compactor",
        "roller",
        "dumpster",
        "portable_toilet",
        "heater",
        "fan",
        "dehumidifier",
        "laser_level",
        "total_station",
        "drone",
        "camera",
        "thermal_camera",
        "safety_equipment",
        "ppe",
        "hand_tool_set",
        "power_tool_set",
        "other",
      ],
      estimate_line_item_type: [
        "labor",
        "material",
        "equipment_rental",
        "equipment_owned",
        "subcontractor",
        "permit_fee",
        "inspection_fee",
        "design_fee",
        "engineering_fee",
        "consulting_fee",
        "delivery",
        "disposal",
        "dumpster",
        "overhead",
        "profit_margin",
        "contingency",
        "tax",
        "discount",
        "credit",
        "allowance",
        "warranty",
        "bond",
        "insurance",
        "travel",
        "fuel",
        "parking",
        "storage",
        "temporary_facilities",
        "cleanup",
        "protection",
        "other",
      ],
      estimate_status: [
        "draft",
        "pending_review",
        "approved_internal",
        "sent",
        "viewed",
        "accepted",
        "declined",
        "expired",
        "revised",
        "countered",
        "archived",
      ],
      expense_category: [
        "materials_lumber",
        "materials_concrete",
        "materials_steel",
        "materials_drywall",
        "materials_insulation",
        "materials_roofing",
        "materials_siding",
        "materials_flooring",
        "materials_tile",
        "materials_paint",
        "materials_hardware",
        "materials_fasteners",
        "materials_electrical",
        "materials_plumbing",
        "materials_hvac",
        "materials_cabinets",
        "materials_countertops",
        "materials_appliances",
        "materials_windows",
        "materials_doors",
        "materials_trim",
        "materials_adhesive_sealant",
        "materials_landscape",
        "materials_masonry",
        "materials_other",
        "equipment_rental",
        "equipment_purchase",
        "equipment_maintenance",
        "equipment_fuel",
        "equipment_repair",
        "vehicle_fuel",
        "vehicle_maintenance",
        "vehicle_insurance",
        "vehicle_lease",
        "vehicle_purchase",
        "vehicle_registration",
        "vehicle_tolls",
        "vehicle_parking",
        "labor_wages",
        "labor_overtime",
        "labor_bonus",
        "labor_payroll_tax",
        "labor_workers_comp",
        "labor_benefits",
        "labor_training",
        "labor_certification",
        "subcontractor_payment",
        "subcontractor_materials",
        "office_rent",
        "office_utilities",
        "office_supplies",
        "office_equipment",
        "office_software",
        "office_phone",
        "office_internet",
        "office_postage",
        "insurance_general_liability",
        "insurance_professional",
        "insurance_workers_comp",
        "insurance_auto",
        "insurance_property",
        "insurance_umbrella",
        "insurance_bond",
        "insurance_builders_risk",
        "professional_accounting",
        "professional_legal",
        "professional_engineering",
        "professional_architecture",
        "professional_design",
        "professional_consulting",
        "marketing_advertising",
        "marketing_website",
        "marketing_print",
        "marketing_signage",
        "marketing_sponsorship",
        "marketing_networking",
        "fee_permit",
        "fee_inspection",
        "fee_license",
        "fee_bank",
        "fee_credit_card_processing",
        "fee_software_subscription",
        "fee_association_dues",
        "disposal_dumpster",
        "disposal_hazmat",
        "disposal_recycling",
        "disposal_dump_fees",
        "travel_mileage",
        "travel_meals",
        "travel_lodging",
        "travel_airfare",
        "travel_parking",
        "taxes",
        "interest",
        "depreciation",
        "miscellaneous",
        "other",
      ],
      expense_status: [
        "pending",
        "approved",
        "rejected",
        "reimbursed",
        "paid",
        "voided",
        "archived",
      ],
      feature_flag_status: ["enabled", "disabled", "beta", "deprecated"],
      incident_severity: ["minor", "moderate", "serious", "critical", "fatal"],
      incident_status: [
        "reported",
        "under_investigation",
        "resolved",
        "closed",
        "escalated",
        "osha_notified",
        "insurance_claimed",
        "legal_action",
      ],
      incident_type: [
        "injury_minor",
        "injury_major",
        "injury_fatal",
        "near_miss",
        "property_damage",
        "vehicle_accident",
        "equipment_failure",
        "fire",
        "electrical",
        "fall",
        "struck_by",
        "caught_in",
        "chemical_exposure",
        "environmental_spill",
        "theft",
        "vandalism",
        "trespassing",
        "client_complaint",
        "neighbor_complaint",
        "code_violation",
        "osha_violation",
        "weather_damage",
        "other",
      ],
      inspection_status: [
        "not_scheduled",
        "scheduled",
        "in_progress",
        "passed",
        "failed",
        "partial",
        "conditional",
        "reinspection_required",
        "cancelled",
        "no_show",
      ],
      inspection_type: [
        "footing",
        "foundation",
        "slab",
        "underground_plumbing",
        "underground_electrical",
        "rough_framing",
        "rough_electrical",
        "rough_plumbing",
        "rough_mechanical",
        "rough_hvac",
        "insulation",
        "vapor_barrier",
        "drywall_nail",
        "fire_blocking",
        "fire_sprinkler",
        "fire_alarm",
        "roofing",
        "waterproofing",
        "structural",
        "energy_compliance",
        "accessibility",
        "final_building",
        "final_electrical",
        "final_plumbing",
        "final_mechanical",
        "final_fire",
        "certificate_of_occupancy",
        "certificate_of_completion",
        "pre_pour",
        "post_tension",
        "special_inspection",
        "soil_compaction",
        "concrete_testing",
        "pool",
        "fence",
        "deck",
        "retaining_wall",
        "gas_line",
        "sewer",
        "water_line",
        "backflow",
        "grease_trap",
        "other",
      ],
      inventory_status: [
        "in_stock",
        "low_stock",
        "out_of_stock",
        "on_order",
        "backordered",
        "discontinued",
        "reserved",
        "allocated",
        "in_transit",
        "returned",
        "damaged",
        "expired",
      ],
      invitation_status: [
        "pending",
        "accepted",
        "expired",
        "revoked",
        "bounced",
      ],
      invoice_status: [
        "draft",
        "pending_approval",
        "approved",
        "sent",
        "viewed",
        "partially_paid",
        "paid",
        "overdue",
        "disputed",
        "voided",
        "write_off",
        "refunded",
        "archived",
      ],
      invoice_type: [
        "standard",
        "progress",
        "draw_request",
        "retainage_release",
        "final",
        "change_order",
        "credit_memo",
        "debit_memo",
        "recurring",
        "deposit",
        "prepayment",
        "time_and_materials",
        "cost_plus",
        "maintenance",
        "warranty",
        "service_call",
        "other",
      ],
      lead_priority: ["urgent", "high", "medium", "low"],
      lead_source: [
        "website_form",
        "website_booking",
        "website_chat",
        "phone_call",
        "walk_in",
        "referral_client",
        "referral_partner",
        "google_ads",
        "facebook_ads",
        "instagram_ads",
        "nextdoor",
        "homeadvisor",
        "angies_list",
        "thumbtack",
        "houzz",
        "yelp",
        "google_maps",
        "google_organic",
        "social_media",
        "email_campaign",
        "direct_mail",
        "door_hanger",
        "yard_sign",
        "trade_show",
        "home_show",
        "networking",
        "repeat_client",
        "property_manager",
        "realtor",
        "insurance_claim",
        "warranty_claim",
        "manual_entry",
        "import",
        "api",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "needs_analysis",
        "estimate_scheduled",
        "estimate_sent",
        "proposal_sent",
        "negotiating",
        "won",
        "lost",
        "disqualified",
        "on_hold",
        "nurturing",
        "reactivated",
        "no_response",
        "archived",
      ],
      lead_temperature: ["hot", "warm", "cool", "cold", "dead"],
      lien_waiver_status: [
        "draft",
        "requested",
        "received",
        "approved",
        "rejected",
        "expired",
        "archived",
      ],
      lien_waiver_type: [
        "conditional_progress",
        "unconditional_progress",
        "conditional_final",
        "unconditional_final",
      ],
      maintenance_type: [
        "preventive",
        "corrective",
        "emergency",
        "inspection",
        "calibration",
        "cleaning",
        "oil_change",
        "tire",
        "brake",
        "fluid",
        "filter",
        "battery",
        "belt",
        "other",
      ],
      material_unit: [
        "each",
        "pair",
        "set",
        "box",
        "case",
        "pallet",
        "linear_foot",
        "square_foot",
        "cubic_foot",
        "linear_yard",
        "square_yard",
        "cubic_yard",
        "linear_meter",
        "square_meter",
        "cubic_meter",
        "inch",
        "foot",
        "yard",
        "meter",
        "ounce",
        "pound",
        "ton",
        "gram",
        "kilogram",
        "gallon",
        "quart",
        "pint",
        "liter",
        "bag",
        "bundle",
        "roll",
        "sheet",
        "board",
        "piece",
        "length",
        "slab",
        "block",
        "brick",
        "truckload",
        "half_truckload",
        "hour",
        "day",
        "week",
        "month",
        "lump_sum",
        "allowance",
        "other",
      ],
      message_channel: [
        "in_app",
        "email",
        "sms",
        "phone_call",
        "video_call",
        "push_notification",
        "webhook",
        "slack",
        "other",
      ],
      message_direction: ["inbound", "outbound", "internal", "system"],
      message_status: [
        "draft",
        "queued",
        "sent",
        "delivered",
        "read",
        "failed",
        "bounced",
        "spam",
        "unsubscribed",
        "archived",
      ],
      notification_priority: ["critical", "high", "normal", "low"],
      notification_type: [
        "lead_new",
        "lead_assigned",
        "lead_status_change",
        "project_created",
        "project_status_change",
        "project_phase_complete",
        "task_assigned",
        "task_due",
        "task_overdue",
        "task_completed",
        "estimate_sent",
        "estimate_viewed",
        "estimate_accepted",
        "estimate_declined",
        "proposal_sent",
        "proposal_viewed",
        "proposal_accepted",
        "proposal_declined",
        "contract_sent",
        "contract_signed",
        "contract_expired",
        "change_order_requested",
        "change_order_approved",
        "change_order_declined",
        "invoice_sent",
        "invoice_viewed",
        "invoice_paid",
        "invoice_overdue",
        "payment_received",
        "payment_failed",
        "payment_refunded",
        "message_received",
        "message_reply",
        "appointment_scheduled",
        "appointment_reminder",
        "appointment_cancelled",
        "inspection_scheduled",
        "inspection_passed",
        "inspection_failed",
        "permit_approved",
        "permit_expired",
        "document_uploaded",
        "document_signed",
        "review_received",
        "review_requested",
        "employee_clocked_in",
        "employee_clocked_out",
        "timesheet_submitted",
        "timesheet_approved",
        "certification_expiring",
        "certification_expired",
        "warranty_expiring",
        "maintenance_due",
        "weather_alert",
        "system_alert",
        "ai_generation_complete",
        "ai_suggestion",
        "custom",
      ],
      page_status: ["draft", "published", "unpublished", "archived"],
      page_type: [
        "home",
        "about",
        "services",
        "service_detail",
        "portfolio",
        "portfolio_detail",
        "reviews",
        "contact",
        "booking",
        "faq",
        "blog",
        "blog_post",
        "team",
        "careers",
        "privacy_policy",
        "terms_of_service",
        "sitemap",
        "custom",
        "landing_page",
      ],
      pay_frequency: [
        "weekly",
        "biweekly",
        "semimonthly",
        "monthly",
        "per_project",
        "on_completion",
        "daily",
      ],
      pay_type: [
        "hourly",
        "salary",
        "per_project",
        "per_task",
        "piece_rate",
        "commission",
        "day_rate",
        "weekly_flat",
        "biweekly_flat",
        "monthly_flat",
      ],
      payment_method: [
        "credit_card",
        "debit_card",
        "ach_bank_transfer",
        "wire_transfer",
        "check",
        "cash",
        "money_order",
        "cashiers_check",
        "zelle",
        "venmo",
        "paypal",
        "apple_pay",
        "google_pay",
        "financing",
        "construction_loan_draw",
        "insurance_payment",
        "barter",
        "trade",
        "other",
      ],
      payment_status: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refunded",
        "partially_refunded",
        "disputed",
        "chargeback",
        "held",
        "released",
      ],
      permit_status: [
        "not_required",
        "research_needed",
        "application_pending",
        "application_submitted",
        "under_review",
        "revisions_required",
        "approved",
        "issued",
        "active",
        "expired",
        "final_approved",
        "denied",
        "cancelled",
        "archived",
      ],
      permit_type: [
        "building",
        "electrical",
        "plumbing",
        "mechanical",
        "hvac",
        "demolition",
        "grading",
        "excavation",
        "foundation",
        "roofing",
        "siding",
        "fence",
        "deck",
        "pool",
        "spa",
        "solar",
        "generator",
        "fire_alarm",
        "sprinkler",
        "sign",
        "driveway",
        "sidewalk",
        "curb_cut",
        "tree_removal",
        "environmental",
        "stormwater",
        "septic",
        "well",
        "zoning_variance",
        "conditional_use",
        "historic_review",
        "hoa_approval",
        "occupancy",
        "temporary_power",
        "road_closure",
        "noise_variance",
        "other",
      ],
      project_complexity: [
        "simple",
        "moderate",
        "complex",
        "highly_complex",
        "custom",
      ],
      project_phase_status: [
        "not_started",
        "in_progress",
        "paused",
        "blocked",
        "review",
        "completed",
        "skipped",
      ],
      project_priority: [
        "emergency",
        "urgent",
        "high",
        "normal",
        "low",
        "scheduled",
      ],
      project_status: [
        "inquiry",
        "estimate_pending",
        "estimate_scheduled",
        "estimate_sent",
        "proposal_sent",
        "proposal_accepted",
        "contract_pending",
        "contract_signed",
        "pre_construction",
        "permitting",
        "permit_approved",
        "material_ordering",
        "materials_received",
        "scheduled",
        "in_progress",
        "on_hold_client",
        "on_hold_weather",
        "on_hold_materials",
        "on_hold_permits",
        "on_hold_subcontractor",
        "on_hold_payment",
        "on_hold_change_order",
        "on_hold_inspection",
        "on_hold_other",
        "punch_list",
        "final_inspection",
        "final_walkthrough",
        "completed",
        "closed",
        "warranty_active",
        "warranty_expired",
        "cancelled",
        "abandoned",
        "disputed",
        "archived",
      ],
      project_type: [
        "repair",
        "maintenance",
        "installation",
        "replacement",
        "remodel",
        "renovation",
        "addition",
        "new_build",
        "restoration",
        "emergency",
        "inspection",
        "consultation",
        "design",
        "engineering",
        "warranty_work",
        "callback",
        "punch_list_item",
        "recurring_maintenance",
        "seasonal",
        "insurance_claim",
        "other",
      ],
      property_age_range: [
        "new_construction",
        "0_5_years",
        "5_10_years",
        "10_20_years",
        "20_50_years",
        "50_100_years",
        "over_100_years",
        "unknown",
      ],
      property_type: [
        "single_family",
        "multi_family",
        "townhouse",
        "condo",
        "co_op",
        "manufactured_home",
        "mobile_home",
        "modular_home",
        "tiny_home",
        "apartment",
        "duplex",
        "triplex",
        "fourplex",
        "commercial_office",
        "commercial_retail",
        "commercial_restaurant",
        "commercial_warehouse",
        "commercial_industrial",
        "commercial_medical",
        "mixed_use",
        "vacant_land",
        "farm_ranch",
        "church",
        "school",
        "government_building",
        "hoa_common_area",
        "other",
      ],
      proposal_status: [
        "draft",
        "internal_review",
        "sent",
        "viewed",
        "accepted",
        "declined",
        "expired",
        "revised",
        "countered",
        "archived",
      ],
      proposal_tier: ["economy", "standard", "premium", "luxury", "custom"],
      recurrence_pattern: [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "quarterly",
        "semiannual",
        "annual",
        "custom",
        "none",
      ],
      relationship_type: [
        "primary",
        "spouse_partner",
        "property_manager",
        "tenant",
        "assistant",
        "decision_maker",
        "billing_contact",
        "emergency_contact",
        "other",
      ],
      retainage_status: [
        "withheld",
        "partially_released",
        "released",
        "disputed",
      ],
      review_source: [
        "google",
        "yelp",
        "facebook",
        "homeadvisor",
        "angies_list",
        "bbb",
        "houzz",
        "nextdoor",
        "thumbtack",
        "internal",
        "testimonial",
        "other",
      ],
      review_status: [
        "pending_approval",
        "published",
        "hidden",
        "flagged",
        "responded",
        "archived",
      ],
      schedule_event_type: [
        "job_work",
        "site_visit",
        "estimate_appointment",
        "consultation",
        "inspection",
        "delivery",
        "permit_pickup",
        "client_meeting",
        "team_meeting",
        "training",
        "maintenance",
        "travel",
        "office_hours",
        "personal",
        "holiday",
        "weather_day",
        "emergency",
        "callback",
        "warranty_visit",
        "final_walkthrough",
        "photo_documentation",
        "other",
      ],
      schedule_status: [
        "tentative",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
        "no_show",
        "weather_cancelled",
      ],
      service_difficulty: ["simple", "moderate", "complex", "expert_only"],
      service_pricing_model: [
        "fixed_price",
        "per_square_foot",
        "per_linear_foot",
        "per_unit",
        "hourly",
        "daily",
        "per_room",
        "per_fixture",
        "tiered",
        "cost_plus_percentage",
        "cost_plus_fixed",
        "time_and_materials",
        "not_to_exceed",
        "subscription_monthly",
        "subscription_annual",
        "free_estimate",
        "call_for_pricing",
        "custom_quote",
      ],
      tag_entity_type: [
        "lead",
        "client",
        "project",
        "estimate",
        "proposal",
        "contract",
        "invoice",
        "document",
        "employee",
        "subcontractor",
        "vendor",
        "property",
        "service",
        "material",
        "equipment",
        "vehicle",
        "note",
        "task",
        "message",
        "other",
      ],
      task_priority: ["critical", "high", "medium", "low", "optional"],
      task_status: [
        "backlog",
        "todo",
        "in_progress",
        "in_review",
        "blocked",
        "completed",
        "cancelled",
        "deferred",
      ],
      tax_type: [
        "sales_tax",
        "use_tax",
        "material_tax",
        "labor_tax",
        "combined",
        "exempt",
        "other",
      ],
      tenant_plan: [
        "trial",
        "starter",
        "professional",
        "business",
        "enterprise",
        "custom",
        "lifetime",
        "free",
      ],
      tenant_status: [
        "trial",
        "active",
        "paused",
        "suspended",
        "cancelled",
        "churned",
        "onboarding",
        "pending_payment",
        "archived",
      ],
      time_entry_status: [
        "clocked_in",
        "clocked_out",
        "pending_approval",
        "approved",
        "rejected",
        "adjusted",
        "locked",
        "paid",
      ],
      time_entry_type: [
        "regular",
        "overtime",
        "double_time",
        "travel",
        "break_paid",
        "break_unpaid",
        "training",
        "meeting",
        "administrative",
        "pto",
        "sick",
        "holiday",
        "bereavement",
        "jury_duty",
        "military",
        "workers_comp",
        "on_call",
        "standby",
        "weather_delay",
        "other",
      ],
      trade_category: [
        "general_contracting",
        "handyman",
        "remodeling",
        "renovation",
        "new_construction",
        "custom_home_building",
        "additions",
        "electrical",
        "plumbing",
        "hvac",
        "roofing",
        "siding",
        "gutters",
        "windows_doors",
        "painting_interior",
        "painting_exterior",
        "staining",
        "drywall",
        "plastering",
        "texture",
        "flooring_hardwood",
        "flooring_tile",
        "flooring_carpet",
        "flooring_vinyl",
        "flooring_laminate",
        "flooring_epoxy",
        "carpentry_rough",
        "carpentry_finish",
        "carpentry_trim",
        "cabinetry",
        "countertops",
        "closet_systems",
        "concrete",
        "masonry",
        "foundation",
        "framing",
        "structural",
        "insulation",
        "weatherization",
        "demolition",
        "excavation",
        "grading",
        "landscaping",
        "hardscaping",
        "irrigation",
        "fencing",
        "decking",
        "patio",
        "pergola",
        "gazebo",
        "pool_construction",
        "pool_maintenance",
        "garage_doors",
        "garage_conversion",
        "basement_finishing",
        "basement_waterproofing",
        "attic_conversion",
        "attic_insulation",
        "kitchen_remodel",
        "bathroom_remodel",
        "home_theater",
        "home_automation",
        "smart_home",
        "security_systems",
        "camera_installation",
        "solar_installation",
        "ev_charger",
        "septic",
        "well_drilling",
        "water_treatment",
        "fire_damage_restoration",
        "water_damage_restoration",
        "mold_remediation",
        "asbestos_abatement",
        "lead_paint",
        "accessibility_modifications",
        "aging_in_place",
        "cleaning_post_construction",
        "cleaning_residential",
        "pest_control",
        "chimney",
        "fireplace",
        "appliance_installation",
        "appliance_repair",
        "pressure_washing",
        "window_cleaning",
        "tree_service",
        "snow_removal",
        "lawn_care",
        "junk_removal",
        "dumpster_rental",
        "moving_services",
        "storage",
        "inspection",
        "consulting",
        "project_management",
        "other",
      ],
      user_role: [
        "platform_superadmin",
        "platform_admin",
        "platform_support",
        "tenant_owner",
        "tenant_admin",
        "tenant_manager",
        "project_manager",
        "estimator",
        "foreman",
        "field_worker",
        "office_staff",
        "bookkeeper",
        "accountant",
        "subcontractor",
        "vendor",
        "client",
        "client_property_manager",
        "readonly",
        "api_service_account",
      ],
      user_status: [
        "active",
        "inactive",
        "invited",
        "pending_verification",
        "suspended",
        "deactivated",
        "locked",
        "archived",
      ],
      vehicle_type: [
        "pickup_truck",
        "cargo_van",
        "box_truck",
        "flatbed",
        "dump_truck",
        "trailer",
        "enclosed_trailer",
        "utility_trailer",
        "car",
        "suv",
        "atv",
        "other",
      ],
      warranty_claim_status: [
        "submitted",
        "under_review",
        "approved",
        "denied",
        "in_progress",
        "completed",
        "escalated",
        "closed",
      ],
      warranty_status: [
        "active",
        "expiring_soon",
        "expired",
        "claimed",
        "claim_approved",
        "claim_denied",
        "voided",
        "transferred",
      ],
      warranty_type: [
        "workmanship",
        "material_manufacturer",
        "material_supplier",
        "extended",
        "limited",
        "full",
        "implied",
        "structural",
        "systems",
        "appliance",
        "roof",
        "paint",
        "flooring",
        "hvac",
        "plumbing",
        "electrical",
        "maintenance_agreement",
        "service_contract",
        "other",
      ],
    },
  },
} as const

