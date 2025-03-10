import moment from 'moment';
import * as XLSX from 'xlsx';
export function writeExcelFile(data:any,title:any) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ['Sheet1'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    saveAsExcelFile(excelBuffer,`${title}_${moment().format('DD_MM_YYYY')}`);
  }
function saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

export function readExcelFile(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const data = new Uint8Array((e.target as any).result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
        fileReader.readAsArrayBuffer(file);
    });
}
