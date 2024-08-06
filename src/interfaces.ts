export interface IInterview {
  id: string
  companyName: string
  vacancyLink: string
  hrName: string
  contactTelegram: string
  contactPhone: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  offerStatus?: boolean | undefined
  stages?: IStage[]
}

export interface IColumnName {
  name: string
  label: string
  field: string
  align?: 'left' | 'right' | 'center'
}

export interface IStage {
  name: string
  date?: string
  description?: string
}
