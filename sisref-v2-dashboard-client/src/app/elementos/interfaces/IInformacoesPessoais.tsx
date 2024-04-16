export interface IInformacoesPessoais {
    name: string;
    mat: string;
    photo?: string;
    course: {
        description: string;
    };
    campus: {
        description: string;
    };
    shift_id: number;
    id: string;
    dateValid: string;
    active: number;
}
