export default async function Home() {
  const res = async () => {
    const result: { message: string } = { message: 'undefined' };
    try {
      const data = await fetch('http://api-service/hello', { cache: 'no-store' });
      result.message = await data.json();
    }
    catch {
      result.message = 'Error';
    }
    return result;
  }
  const { message } = await res();

  return (
    <div>
      {message}
    </div>
  );
}