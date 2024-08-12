export interface IInformacoesDeLogin {
    access_token: string
    token_type: string
    id: number
    classfication: 'STUDENT' | 'ASSIS_ESTU' | 'RECEPCAO' | 'NUTRI' | 'ADMIN'
    name: string
    campus: number
    active: number
    expires_in: number
}
