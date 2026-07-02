export type WpRenderedField = {
  rendered: string;
};

export type WpMedia = {
  id: number;
  source_url: string;
  alt_text: string;
  mime_type?: string;
  title: WpRenderedField;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<
      string,
      {
        source_url: string;
        width: number;
        height: number;
      }
    >;
  };
};

export type HomePageAcf = {
  hero_title: string;
  hero_text: string;
  hero_logo: number;
  hero_bg: number;
  hero_video: number;
  hero_video_mob: number;

  about_top_title: string;
  about_title: string;
  about_text: string;
  about_bg: number;
  about_logos: {
    logo: number;
  }[];

  investments_top_title: string;
  investments_title: string;
  investments_img: number;
  investments_text_one: string;
  investments_text_two: string;
  investments_list: {
    title: string;
    text: string;
  }[];

  advantages_top_title: string;
  advantages_title: string;
  advantages_text: string;
  advantages_img: number;
  advantages_tabs: {
    name: string;
    list: {
      title: string;
      text: string;
    }[];
  }[];

  income_list: {
    name: string;
    title: string;
    text: string;
    img_one: number;
    img_two: number;
  }[];

  location_top_title: string;
  location_title: string;
  location_text_one: string;
  location_text_two: string;
  location_bg: number;

  point_list: {
    name: string;
    title: string;
    text: string;
    list: {
      title: string;
      text: string;
    }[]
    img_one: number;
    img_two: number;
  }[];

  concept_top_title: string;
  concept_title: string;
  concept_img_one: number;
  concept_text_one: string;
  concept_text_two: string;
  concept_img_two: number;
  concept_img_three: number;

  product_list: {
    name: string;
    title: string;
    text: string;
    list: {
      title: string;
      text: string;
    }[]
    img_one: number;
    list_img: {
      name: string;
      img: number
    }[];
  }[];

  open_form_title: string;
  open_form_text: string;
  open_form_bg: number;

  infrastructure_top_title: string;
  infrastructure_title: string;
  infrastructure_text: string;
  infrastructure_img: number;

  infrastructure_list: {
    title: string;
    text: string;
    img: number | number[];
  }[];

  infrastructure_list_two: {
    title: string;
    text: string;
    img: number[];
  }[];

  service_top_title: string;
  service_title: string;
  service_text: string;
  service_gallery: number[];

  service_list_one: {
    title: string;
    text: string;
    img: number;
  }[];

  service_list: {
    title: string;
    text: string;
    img: number | number[];
  }[];

  rooms_list: {
    title: string;
    square: string;
    text: string;
    img: number[];
    income: number;
    plans: number[];
  }[];

  finance_top_title: string;
  finance_title: string;
  finance_text: string;
  finance_img: number;
  finance_list_one: {
    percent: string;
    text: string;
  }[];
  finance_list_two: {
    numb: string;
    text: string;
  }[];

  gallery_top_title: string;
  gallery_title: string;
  gallery_list: number[];
};

export type WpPage<TAcf = Record<string, unknown>> = {
  id: number;
  slug: string;
  title: WpRenderedField;
  content: WpRenderedField & {
    protected: boolean;
  };
  excerpt: WpRenderedField & {
    protected: boolean;
  };
  acf: TAcf;
};


export type WpLink = {
  title: string;
  url: string;
  target: string;
};

export type HeaderOptions = {
  logo: number;
  phone: string;
  menu_img: number;
};

export type FooterOptions = {
  address: string;
  work_time: string;
  map_link: WpLink;
  logo: number;
  phone: string;
  social: {
    link: string;
    icon: number;
  }[];
  policy_links: {
    link: WpLink;
  }[];
  metriks_link: WpLink;
  docs_link: WpLink;
  text: string;
};

export type PopupOptions = {
  logo: number;
  text: string;
  img: number
};

export type SiteOptions = {
  footer: FooterOptions;
  header: HeaderOptions;
  popup: PopupOptions;
};
