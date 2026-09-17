import { CareLink, PageIntro } from '@/components/shared';
export default function NotFound() {
  return (
    <>
      <PageIntro
        eyebrow="LET’S GET YOU HOME"
        title="This page has wandered off."
        description="We couldn’t find that page. Our home page is a good place to start."
      />
      <div className="container text-center py-14">
        <CareLink href="/">Back to home</CareLink>
      </div>
    </>
  );
}
