import { ScrollStage } from "@/components/ScrollStage";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { InvestmentsSection } from "@/components/sections/InvestmentsSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { IncomeSection } from "@/components/sections/IncomeSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { PointSection } from "@/components/sections/PointSection";
import { ProductSection } from "@/components/sections/ProductSection";
import { ConceptSection } from "@/components/sections/ConceptSection";
import { OpenFormSection } from "@/components/sections/OpenFormSection";
import { InfrastructureSection } from "@/components/sections/InfrastructureSection";
import { GenplanSection } from "@/components/sections/GenplanSection";
import { InfrastructureSliderSection } from "@/components/sections/InfrastructureSliderSection";
import { InfrastructureFullscreenSliderSection } from "@/components/sections/InfrastructureFullscreenSliderSection";
import { ServiceSection } from "@/components/sections/ServiceSection";
import { ServiceSliderSection } from "@/components/sections/ServiceSliderSection";

import { RoomsSection } from "@/components/sections/RoomsSection";
import { FinanceSection } from "@/components/sections/FinanceSection";
import { GallerySection } from "@/components/sections/GallerySection";

import { fetchMediaById, getHomePage } from "@/lib/wordpress";
import styles from "./page.module.css";

export const revalidate = 300;

export default async function Home() {
  const page = await getHomePage();

  const heroTitle = page?.acf?.hero_title || "";
  const heroText = page?.acf?.hero_text || "";
  const heroLogo = await fetchMediaById(page?.acf?.hero_logo);
  const heroBg = await fetchMediaById(page?.acf?.hero_bg);

  const aboutTopTitle = page?.acf?.about_top_title || "";
  const aboutTitle = page?.acf?.about_title || "";
  const aboutText = page?.acf?.about_text || "";
  const aboutBg = await fetchMediaById(page?.acf?.about_bg);
  const aboutLogos = (
    await Promise.all(
      (page?.acf?.about_logos ?? []).map((item) => fetchMediaById(item.logo)),
    )
  ).filter((logo) => logo !== null);

  const investmentsTopTitle = page?.acf?.investments_top_title || "";
  const investmentsTitle = page?.acf?.investments_title || "";
  const investmentsImg = await fetchMediaById(page?.acf?.investments_img);
  const investmentsTextOne = page?.acf.investments_text_one || "";
  const investmentsTextTwo = page?.acf.investments_text_two || "";
  const investmentsList = page?.acf.investments_list ?? [];

  const advantagesTopTitle = page?.acf?.advantages_top_title || "";
  const advantagesTitle = page?.acf?.advantages_title || "";
  const advantagesImg = await fetchMediaById(page?.acf.advantages_img);
  const advantagesText = page?.acf.advantages_text || "";
  const advantagesTabs = page?.acf.advantages_tabs ?? [];

  const incomeTabs = await Promise.all(
    (page?.acf.income_list ?? []).slice(0, 2).map(async (item) => ({
      name: item.name,
      title: item.title,
      text: item.text,
      img_one: await fetchMediaById(item.img_one),
      img_two: await fetchMediaById(item.img_two),
    })),
  );

  const locationTopTitle = page?.acf.location_top_title || "";
  const locationTitle = page?.acf.location_title || "";
  const locationTextOne = page?.acf.location_text_one || "";
  const locationTextTwo = page?.acf.location_text_two || "";
  const locationImg = await fetchMediaById(page?.acf.location_bg);

  const pointTabs = await Promise.all(
    (page?.acf.point_list ?? []).slice(0, 2).map(async (item) => ({
      name: item.name,
      title: item.title,
      text: item.text,
      list: item.list,
      img_one: await fetchMediaById(item.img_one),
      img_two: await fetchMediaById(item.img_two),
    })),
  );

  const productTabs = await Promise.all(
    (page?.acf.product_list ?? []).slice(0, 2).map(async (item) => ({
      name: item.name,
      title: item.title,
      text: item.text,
      list: item.list,
      img_one: await fetchMediaById(item.img_one),
      list_img: await Promise.all(
        item.list_img.map(async (imgItem) => ({
          name: imgItem.name,
          img: await fetchMediaById(imgItem.img),
        })),
      ),
    })),
  );

  const conceptTopTitle = page?.acf.concept_top_title || "";
  const conceptTitle = page?.acf.concept_title || "";
  const conceptImgOne = await fetchMediaById(page?.acf.concept_img_one);
  const conceptTextOne = page?.acf.concept_text_one || "";
  const conceptTextTwo = page?.acf.concept_text_two || "";
  const conceptImgTwo = await fetchMediaById(page?.acf.concept_img_two);
  const conceptImgThree = await fetchMediaById(page?.acf.concept_img_three);

  const openFormTitle = page?.acf.open_form_title || "";
  const openFormText = page?.acf.open_form_text || "";
  const openFormBg = await fetchMediaById(page?.acf.open_form_bg);

  const infrastructureTopTitle = page?.acf.infrastructure_top_title || "";
  const infrastructureTitle = page?.acf.infrastructure_title || "";
  const infrastructureText = page?.acf.infrastructure_text || "";
  const infrastructureImg = await fetchMediaById(page?.acf.infrastructure_img);
  const infrastructureSlides = await Promise.all(
    (page?.acf.infrastructure_list ?? []).map(async (item) => ({
      title: item.title,
      text: item.text,
      img: await fetchMediaById(item.img),
    })),
  );
  const infrastructureFullscreenSlides = await Promise.all(
    (page?.acf.infrastructure_list_two ?? []).map(async (item) => ({
      title: item.title,
      text: item.text,
      img: await fetchMediaById(item.img),
    })),
  );

  const serviceTopTitle = page?.acf.service_top_title || "";
  const serviceTitle = page?.acf.service_title || "";
  const serviceText = page?.acf.service_text || "";
  const serviceGallery = (
    await Promise.all(
      (page?.acf.service_gallery ?? []).map((id) => fetchMediaById(id)),
    )
  ).filter((img) => img !== null);

  const serviceSlides = await Promise.all(
    (page?.acf.service_list ?? []).map(async (item) => ({
      title: item.title,
      text: item.text,
      img: await fetchMediaById(item.img),
    })),
  );

  const roomsSectionSlides = await Promise.all(
    (page?.acf.rooms_list ?? []).map(async (item) => ({
      title: item.title,
      square: item.square,
      text: item.text,
      img: await fetchMediaById(item.img),
      income: await fetchMediaById(item.income),
      plans: (
        await Promise.all((item.plans ?? []).map((id) => fetchMediaById(id)))
      ).filter((plan) => plan !== null),
    })),
  );

  const financeTopTitle = page?.acf?.finance_top_title || "";
  const financeTitle = page?.acf?.finance_title || "";
  const financeImg = await fetchMediaById(page?.acf?.finance_img);
  const financeText = page?.acf.finance_text || "";
  const financeListOne = page?.acf.finance_list_one ?? [];
  const financeListTwo = page?.acf.finance_list_two ?? [];

  const galleryTopTitle = page?.acf.gallery_top_title || "";
  const galleryTitle = page?.acf.gallery_title || "";
  const galleryList = (
    await Promise.all(
      (page?.acf.gallery_list ?? []).map((id) => fetchMediaById(id)),
    )
  ).filter((img) => img !== null);

  return (
    <main className={styles.main}>
      <ScrollStage>
        <HeroSection title={heroTitle} text={heroText} logo={heroLogo} bgImg={heroBg}/>
        <AboutSection
          top_title={aboutTopTitle}
          title={aboutTitle}
          text={aboutText}
          bgImg={aboutBg}
          logos={aboutLogos}
        />
        <InvestmentsSection
          top_title={investmentsTopTitle}
          title={investmentsTitle}
          img={investmentsImg}
          text_one={investmentsTextOne}
          text_two={investmentsTextTwo}
          list={investmentsList}
        />
      </ScrollStage>
      <AdvantagesSection
        top_title={advantagesTopTitle}
        title={advantagesTitle}
        text={advantagesText}
        img={advantagesImg}
        tabs={advantagesTabs}
      />
      <IncomeSection tabs={incomeTabs} /> 
      <LocationSection
        top_title={locationTopTitle}
        title={locationTitle}
        text_one={locationTextOne}
        text_two={locationTextTwo}
        img={locationImg}
      />
      <PointSection tabs={pointTabs} />
      <ConceptSection
        top_title={conceptTopTitle}
        title={conceptTitle}
        img_one={conceptImgOne}
        text_one={conceptTextOne}
        text_two={conceptTextTwo}
        img_two={conceptImgTwo}
        img_three={conceptImgThree}
      />
      <ProductSection tabs={productTabs} />
      <OpenFormSection
        title={openFormTitle}
        text={openFormText}
        bg={openFormBg}
      />
      <InfrastructureSection
        top_title={infrastructureTopTitle}
        title={infrastructureTitle}
        text={infrastructureText}
        img={infrastructureImg}
      />
      <GenplanSection/>
      <InfrastructureSliderSection slides={infrastructureSlides} />
      <InfrastructureFullscreenSliderSection
        slides={infrastructureFullscreenSlides}
      />
      <ServiceSection
        top_title={serviceTopTitle}
        title={serviceTitle}
        text={serviceText}
        gallery={serviceGallery}
      /> 
      <ServiceSliderSection slides={serviceSlides} />
      <RoomsSection
        slides={roomsSectionSlides}
      />  
      <FinanceSection
        top_title={financeTopTitle}
        title={financeTitle}
        img={financeImg}
        text={financeText}
        list_one={financeListOne}
        list_two={financeListTwo}
      />
      <GallerySection
        top_title={galleryTopTitle}
        title={galleryTitle}
        gallery={galleryList}
      />
    </main>
  );
}
