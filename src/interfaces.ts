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
  salaryRange?: string
  offerStatusText?: 'Waiting' | 'Accepted' | 'Declined'
}

export interface IColumnName {
  name: string
  label: string
  field: string | ((row: IInterview) => string)
  align?: 'left' | 'right' | 'center'
}

export interface IStage {
  name: string
  date: string | null
  description?: string
}
