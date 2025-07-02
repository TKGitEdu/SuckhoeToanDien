# Cần triển khai các hàm sau:

## Trong dashboardAPI.ts:

1. **getPatientsByDoctorId(doctorId: string): Promise<Patient[]>**
   - Lấy danh sách bệnh nhân của bác sĩ
   - API path: `/api/DoctorDashBoard/patients/{doctorId}`
   - Method: GET
   - Return: Danh sách bệnh nhân của bác sĩ

2. **getPatientDetails(patientId: string): Promise<Patient>**
   - Lấy thông tin chi tiết của một bệnh nhân
   - API path: `/api/DoctorDashBoard/patient/{patientId}`
   - Method: GET
   - Return: Thông tin chi tiết của bệnh nhân

3. **getPatientTreatmentHistory(patientId: string): Promise<TreatmentProcesses[]>**và TreatmentPlan tương tứng
   - Lấy lịch sử điều trị của bệnh nhân 
   - API path: `/api/DoctorDashBoard/patient/{patientId}/treatment-history`
   - Method: GET
   - Return: Danh sách các bản ghi điều trị của bệnh nhân, TreatmentProcesses

4. **getPatientTestResults(patientId: string): Promise<Examinations[]>**
   - Lấy kết quả xét nghiệm của bệnh nhân
   - API path: `/api/DoctorDashBoard/patient/{patientId}/test-results`
   - Method: GET
   - Return: Danh sách các kết quả xét nghiệm của bệnh nhân

5. **updateExaminationtNote(patientId: string,DoctorId, BookingId, note: string): Promise<Examination>**
   - Cập nhật ghi chú cho bệnh nhân
   - API path: `/api/DoctorDashBoard/patient/{patientId}/note`
   - Method: PUT
   - Body: `{ "note": "string" }`
   - Return: Thông tin kiểm tra đã cập nhật

6. **addNewTreatmentProcesses(record: TreatmentProcesses): Promise<TreatmentProcesses>**
   - Thêm bản ghi điều trị mới
   - API path: `/api/DoctorDashBoard/treatment-record`
   - Method: POST
   - Body: TreatmentRecord object
   - Return: Bản ghi điều trị đã được tạo

## Trong appointmentsAPI.ts:

1. **getAppointmentsByPatientId(patientId: string): Promise<Booking[]>**
   - Lấy danh sách lịch hẹn của một bệnh nhân
   - API path: `/api/DoctorDashBoard/patient/{patientId}/appointments`
   - Method: GET
   - Return: Danh sách lịch hẹn của bệnh nhân

2. **createAppointmentForPatient(patientId: string, appointment: BookingData): Promise<Booking>**
   - Tạo lịch hẹn mới cho bệnh nhân
   - API path: `/api/DoctorDashBoard/booking`
   - Method: POST
   - Body: BookingData object
   - Return: Thông tin lịch hẹn đã được tạo



