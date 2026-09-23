export interface SalaryReport {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  month: number
  year: number
  basicSalary: number
  attendanceDays: number
  absenceDays: number
  totalOvertimeHours: number
  totalDeductionHours: number
  totalOvertimeAmount: number
  totalDeductionAmount: number
  netSalary: number
}