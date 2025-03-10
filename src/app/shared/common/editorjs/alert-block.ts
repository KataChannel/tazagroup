class AlertBlock {
  private api: any;
  private data: { message: string; type: 'info' | 'error' };
  private wrapper: HTMLElement;

  static get toolbox() {
    return {
      title: 'Alert',
      icon: '⚠️'
    };
  }

  constructor({ data, api }: { data?: { message: string; type: 'info' | 'error' }; api: any }) {
    this.api = api;
    this.data = data || { message: '', type: 'info' };
    this.wrapper = document.createElement('div');
  }

  render() {
    const typeClass = {
      info: 'bg-blue-100 border-blue-500',
      error: 'bg-red-100 border-red-500'
    }[this.data.type];

    this.wrapper.innerHTML = `
      <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-bold text-center mb-4">PHIẾU ĐỀ NGHỊ THANH TOÁN, QUYẾT TOÁN</h2>
        
        <div class="border p-4 rounded-lg">
          <p><strong>Kính gửi:</strong> {{ paymentRequest.recipient }}</p>
          <p><strong>Họ và tên:</strong> {{ paymentRequest.name }}</p>
          <p><strong>Bộ phận:</strong> {{ paymentRequest.department }}</p>
          <p><strong>Chức vụ:</strong> {{ paymentRequest.position }}</p>
          <p><strong>Ngày:</strong> {{ paymentRequest.date }}</p>
        </div>
      
        <h3 class="text-lg font-semibold mt-4">Đề Nghị Chi Số Tiền: {{ paymentRequest.totalAmount | number }}đ</h3>
      
        <div class="overflow-x-auto">
          <table class="w-full mt-4 border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border px-4 py-2">STT</th>
                <th class="border px-4 py-2">Nội dung</th>
                <th class="border px-4 py-2">Số tiền</th>
                <th class="border px-4 py-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of paymentRequest.details">
                <td class="border px-4 py-2 text-center">{{ item.id }}</td>
                <td class="border px-4 py-2">{{ item.description }}</td>
                <td class="border px-4 py-2 text-right">{{ item.amount | number }}</td>
                <td class="border px-4 py-2 text-center">{{ item.note }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-bold">
                <td colspan="2" class="border px-4 py-2 text-right">Tổng cộng:</td>
                <td class="border px-4 py-2 text-right">{{ paymentRequest.totalAmount | number }}</td>
                <td class="border px-4 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      
        <p class="mt-4"><strong>Số Tiền Bằng Chữ:</strong> {{ paymentRequest.amountInWords }}</p>
      
        <div class="grid grid-cols-3 gap-4 text-center mt-6">
          <div>
            <p class="font-semibold">Giám đốc Kế toán</p>
            <p class="text-sm italic">(Ký, ghi rõ họ tên)</p>
          </div>
          <div>
            <p class="font-semibold">Trưởng bộ phận</p>
            <p class="text-sm italic">(Ký, ghi rõ họ tên)</p>
          </div>
          <div>
            <p class="font-semibold">Người đề nghị</p>
            <p class="text-sm italic">(Ký, ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    `;

    this.wrapper.querySelector('input')?.addEventListener('input', (event) => {
      this.data.message = (event.target as HTMLInputElement).value;
    });

    this.wrapper.querySelector('select')?.addEventListener('change', (event) => {
      this.data.type = (event.target as HTMLSelectElement).value as 'info' | 'error';
    });

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}

export default AlertBlock;