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
    shift_id: 1 | 2 | 3 | 4;
    id: string;
    dateValid: string;
    active: number;
}
