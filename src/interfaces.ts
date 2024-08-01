export interface IInterview {
  id: string
  companyName: string
  vacancyLink: string
  hrName: string
  contactTelegram: string
  contactPhone: string
  createdAt: Date
}

export interface IColumnName {
  name: string
  label: string
  field: string
  align?: 'left' | 'right' | 'center'
}
