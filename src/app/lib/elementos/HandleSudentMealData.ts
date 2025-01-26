interface StudentMealData {
  student_id: number;
  meal_id: number;
  friday?: boolean;
  monday?: boolean;
  saturday?: boolean;
  thursday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  comentario?: string;
}

export const handleStudentMealData = (data: any): StudentMealData => {
  return {
    student_id: data.student_id,
    meal_id: data.meal_id,
    friday: data.friday || false,
    monday: data.monday || false,
    saturday: data.saturday || false,
    thursday: data.thursday || false,
    tuesday: data.tuesday || false,
    wednesday: data.wednesday || false,
    comentario: data.comentario || '',
  };
};