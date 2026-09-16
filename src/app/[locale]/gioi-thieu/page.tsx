import AboutPage from '../about/page';

interface GioiThieuPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GioiThieuPage({ params }: GioiThieuPageProps) {
  return <AboutPage params={params} />;
}
