export interface IInformacoesDeEstudante {
    id: number;
    active: number;
    dateValid: string;
    mat: string;
    name: string;
    semRegular: number;
    course_id: number;
    shift_id: 1 | 2 | 3 | 4;    
    photo: string | null;
    campus_id: number;
    observation: string | null;
    republic: string | null;
    block: string | null;
    absent_meal: number;
    course: {
        id: number;
        description: string;
        initials: string;
        campus_id: number;
    }
}