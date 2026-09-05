export interface Attendance {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  date: string
  checkInTime: any
  checkOutTime: any
  overtimeHours: number
  deductionHours: number
  status: number
  notes: any
}