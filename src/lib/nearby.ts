import data from './nearby-places.json';
import { SITE } from './site';
import { accessByPlace } from './nearby-access';
import type { Metadata } from 'next';

export const places = data;
export type Place = (typeof places)[number];
export const areas = {
  v: ['威尼斯', 'Venice'],
  m: ['玛丽安德尔湾及南岸', 'Marina del Rey & Playa del Rey'],
  s: ['圣莫尼卡', 'Santa Monica'],
} as const;

const areaTransport = {
  v: ['从运河出发可优先比较步行路线。去海滨时沿公共街道走，跨太平洋大道请走有标线的过街点。', 'Compare walking routes from the canals first. Stay on public streets and use marked crossings on Pacific Avenue when heading to the beach.'],
  m: ['先确认目的地在港湾哪一岸。港池与主航道隔开部分地点，沿水边看似很近，陆路可能需要绕行。', 'Check which side of the marina your destination is on. Basins and the main channel can make the route on land longer than it looks across the water.'],
  s: ['前往南侧海滨地点可比较沿海岸步行或骑行路线。若目的地靠近市中心码头，市区来客也可比较地铁 E 线到 Downtown Santa Monica 后步行的路线。', 'For the southern waterfront stops, compare the coastal walking and cycling routes. For a destination near the downtown pier, visitors arriving from inland can also take the Metro E Line to Downtown Santa Monica and walk.'],
} as const;

const operators: Record<string, [string, string]> = {
  county: ['洛杉矶县海滩与港湾局', 'LA County Department of Beaches and Harbors'],
  la: ['洛杉矶市康乐与公园局', 'City of Los Angeles Department of Recreation and Parks'],
  street: ['公共街道由洛杉矶市管理，商铺各自经营', 'City of Los Angeles manages the public streets. Businesses operate independently.'],
  library: ['洛杉矶公共图书馆', 'Los Angeles Public Library'],
  baroque: ['Beyond Baroque 文学艺术中心', 'Beyond Baroque Literary Arts Center'],
  private: ['私人办公物业，由 Luzzatto Company 持有', 'Private office property owned by The Luzzatto Company'],
  sign: ['威尼斯商会为字牌维护筹款并组织相关活动，交叉路口属于洛杉矶市公共街道', 'The Venice Chamber of Commerce raises funds for sign maintenance and coordinates events. The intersection is part of the City of Los Angeles street network.'],
  fisher: ['洛杉矶县管理港湾租赁，村内商铺与游船由各经营方运营', 'LA County oversees marina leases. Individual businesses and cruise operators run their own services.'],
  dockweiler: ['加州州立海滩，由洛杉矶县海滩与港湾局运营', 'California state beach operated by the LA County Department of Beaches and Harbors'],
  mosaic: ['切丽·潘与贡萨洛·杜兰', 'Cheri Pann and Gonzalo Duran'],
  cdfw: ['加州鱼类与野生动物局', 'California Department of Fish and Wildlife'],
  sm: ['圣莫尼卡市', 'City of Santa Monica'],
  pac: ['Pacific Park 游乐园运营方', 'Pacific Park amusement park operator'],
  heal: ['Heal the Bay', 'Heal the Bay'],
};

const openingHours: Record<string, [string, string]> = {
  'burton-chace-park': ['每天 06:00–22:00。', 'Daily, 6 a.m.–10 p.m.'],
  'venice-library': ['周一、周三 10:00–20:00，周二、周四 12:00–20:00，周五、周六 09:30–17:30，周日闭馆。', 'Mon and Wed 10 a.m.–8 p.m., Tue and Thu noon–8 p.m., Fri and Sat 9:30 a.m.–5:30 p.m., closed Sun.'],
  'heal-the-bay-aquarium': ['常规公众开放暂停，请查看预约与活动安排。', 'Regular public hours are paused. Check reservations and scheduled programs.'],
  'ballona-wetlands': ['符合条件的开放区域和预约导览以州政府公告为准。', 'See the state’s visitor notice for public access areas and scheduled tours.'],
};

export function placeDetails(place: Place, locale: string) {
  const zh = locale === 'zh';
  const index = zh ? 0 : 1;
  const areaKey = place.area as keyof typeof areas;
  const area = areas[areaKey][index];
  const query = encodeURIComponent(place.en + ', ' + place.address);
  const map = 'https://www.google.com/maps/search/?api=1&query=' + query;
  const transit = 'https://www.google.com/maps/dir/?api=1&origin=Venice+Canal+Historic+District%2C+Venice%2C+Los+Angeles%2C+CA&destination=' + query;
  const access = accessByPlace[place.slug];
  const admission = {
    public: zh ? '公共区域免费，停车或活动可能另收费。' : 'Public access is free. Parking or events may cost extra.',
    street: zh ? '公共街道免费，店铺或活动各自收费。' : 'The public approach is free. Shops and events set their own charges.',
    program: zh ? '按场次或场馆规定查询门票，部分项目须预约。' : 'Check admission and reservation requirements with the venue.',
    ride: zh ? '码头公共区域免费，游乐项目另收费。' : 'Public pier access is free. Attractions charge separately.',
  };
  return {
    area,
    map,
    directions: transit,
    transport: areaTransport[areaKey][index],
    name: zh ? place.zh : place.en,
    description: zh ? place.descriptionZh : place.descriptionEn,
    operator: operators[place.operator][index],
    hours: access?.hours?.[index] ?? openingHours[place.slug]?.[index] ?? (place.access === 'street'
      ? (zh ? '公共人行道可通行，场所营业时间各异。' : 'Public sidewalks are accessible. Venue hours vary.')
      : (zh ? '出发前查看到访资料，临时开放安排以现场为准。' : 'Check current visitor information before leaving and follow posted access hours.')),
    admission: access?.admission?.[index] ?? admission[place.access as keyof typeof admission],
    hoursSource: access?.hoursSource ?? place.source,
    admissionSource: access?.admissionSource ?? place.source,
  };
}

export function nearbyMetadata(locale: string, path: string, title: string, description: string, photo?: string): Metadata {
  const canonical = `${SITE.baseUrl}/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        zh: SITE.baseUrl + '/zh' + path,
        en: SITE.baseUrl + '/en' + path,
        'x-default': SITE.baseUrl + '/zh' + path,
      },
    },
    openGraph: { title, description, url: canonical, images: photo ? [{ url: photo, alt: title }] : [] },
    twitter: { title, description, card: photo ? 'summary_large_image' : 'summary', images: photo ? [photo] : [] },
  };
}
