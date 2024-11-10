export default function ImageUploader() {
  const pdfUrl = '/menu1.pdf';

  return (
    <iframe
      src={pdfUrl}
      width="100%"
      height="600px"
      style={{ border: 'none' }}
      fill="true"
      priority="true"
    />
  );
}