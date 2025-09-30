import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Assignment {
  id: string;
  course_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  attachment_type: 'file' | 'link' | 'both' | null;
  attachment_url: string | null;
  attachment_file_path: string | null;
  due_date: string | null;
  points: number;
  position: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export const useAssignments = (courseId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data as Assignment[];
    },
  });

  const createAssignment = useMutation({
    mutationFn: async (assignment: Omit<Partial<Assignment>, 'id' | 'created_at' | 'updated_at'> & { course_id: string; title: string }) => {
      const { data, error } = await supabase
        .from("assignments")
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", courseId] });
      toast({
        title: "สำเร็จ",
        description: "เพิ่มการบ้านเรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Assignment> & { id: string }) => {
      const { data, error } = await supabase
        .from("assignments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", courseId] });
      toast({
        title: "สำเร็จ",
        description: "อัพเดทการบ้านเรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", courseId] });
      toast({
        title: "สำเร็จ",
        description: "ลบการบ้านเรียบร้อยแล้ว",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    isLoading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
