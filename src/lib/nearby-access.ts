type Bilingual = readonly [string, string];

type Access = {
  hours?: Bilingual;
  admission?: Bilingual;
  hoursSource?: string;
  admissionSource?: string;
};

const countyParking = 'https://beaches.lacounty.gov/parking-lots/';
const pierFaq = 'https://www.santamonicapier.org/faqs';
const cityParkCode = 'https://ecode360.com/42727988';
const cityParkHours: Access = {
  hours: ['按市立公园常规规则，06:00–23:00 开放。临时调整以入口公告为准。', 'Normal city park hours are 6 a.m.–11 p.m. Follow posted changes.'],
  hoursSource: cityParkCode,
};

export const accessByPlace: Record<string, Access> = {
  'venice-beach': {
    hours: ['县政府列出的海滩停车场时间为 06:00–22:00；救生员在白天值勤。海滩通行请看当日标示。', 'The county lists beach lot hours as 6 a.m.–10 p.m. and lifeguard service during daylight. Check posted beach access.'],
    admission: ['公共沙滩免费；停车、设备租借及课程另计。', 'Public beach access is free. Parking, rentals and lessons are separate.'],
    admissionSource: countyParking,
  },
  'venice-boardwalk': {
    hours: ['建议白天到访公共步行道；商铺与现场表演各有时间。', 'Visit the public promenade in daylight. Shops and performers keep their own schedules.'],
    admission: ['步行道免费通行；商铺与现场项目各自定价。', 'The promenade is free to walk. Shops and activities set their own prices.'],
  },
  'venice-skatepark': {
    hours: ['露天场地，宜在白天到访；设施开放以场地标示为准。', 'Visit the outdoor facility in daylight and check on-site signs for access.'],
    admission: ['滑板场为免费公共设施。', 'The public skatepark is free to use.'],
  },
  'muscle-beach-venice': {
    hours: ['围栏外可在海滨步行时观看；场内训练使用健身场的开放时段。', 'Watch from the promenade. Gym users follow the facility’s training hours.'],
    admission: ['从公共步道观看免费。进入重量训练区需通行证，地方旅游指南列出日票 20 美元，购买前请核对。', 'Watching from the promenade is free. A gym pass is required to use the weights. The local visitor guide lists a $20 day pass. Confirm the price before visiting.'],
    hoursSource: 'https://www.visitveniceca.com/2026/03/02/venice-beach-parks-and-recreation-2/',
    admissionSource: 'https://www.visitveniceca.com/2026/03/02/venice-beach-parks-and-recreation-2/',
  },
  'venice-fishing-pier': {
    hours: ['甲板通行以入口公告为准。若因维护或天气封闭，可在临近海滨看码头外观。', 'Check the gate for deck access. If it is closed for maintenance or weather, view the pier from the waterfront.'],
    admission: ['公共码头开放时可免费步行进入，海滨停车另计。', 'The public deck is free to walk when open. Waterfront parking is separate.'],
    admissionSource: countyParking,
  },
  'abbot-kinney-boulevard': {
    hours: ['公共街道可步行；餐厅、商铺及集市分别营业。午后适合安排逛店。', 'The boulevard is a public street. Shops, restaurants and markets keep separate hours. Afternoon is a practical time to browse.'],
    admission: ['街道免费通行，购物、餐饮和特别活动由经营方定价。', 'There is no charge to walk the street. Shops, restaurants and special events set their own prices.'],
  },
  'venice-sign': {
    hours: ['可从公共人行道观看。节庆亮灯活动以威尼斯商会公告为准。', 'View from the public sidewalk. Check the Venice Chamber for special lighting events.'],
    admission: ['在人行道观看字牌免费。', 'There is no charge to see the sign from the sidewalk.'],
  },
  'venice-breakwater': {
    hours: ['建议白天从海滩观浪。沙滩的到访条件随海况与现场告示变化。', 'Watch the waves from the beach in daylight. Check posted beach access and conditions first.'],
    admission: ['从公共沙滩观看免费；停车和冲浪服务另计。', 'Viewing from the beach is free. Parking and surf services are separate.'],
  },
  'venice-library': {
    admission: ['公众入馆和现场阅览免费。借阅按洛杉矶公共图书馆的办证规则办理。', 'Entry and on-site reading are free. Borrowing follows Los Angeles Public Library card rules.'],
  },
  'beyond-baroque': {
    hours: ['书店营业与演出场次分开安排。出发前查看活动日历和开门时间。', 'Bookstore hours and public events are scheduled separately. Check the calendar and door times.'],
    admission: ['户外看建筑免费；朗读和工作坊按场次查看费用及报名要求。', 'The exterior is free to view. Check individual readings and workshops for fees and registration.'],
  },
  'binoculars-building': {
    hours: ['外观在公共人行道可见，适合白天到访。', 'The exterior is visible from the public sidewalk and best seen in daylight.'],
    admission: ['从人行道观看外观免费，按私人办公楼外观参观。', 'The exterior is free to view from the sidewalk. Plan for an exterior visit to a private office building.'],
  },
  'mosaic-tile-house': {
    hours: ['私人住宅，按屋主确认的预约时段参观。', 'Visit the private home by appointment at a time confirmed by the hosts.'],
    admission: ['按预约安排收费。预约时请向屋主确认成人及儿童票价。', 'Admission is arranged with the booking. Confirm adult and child prices with the hosts.'],
  },
  'marina-beach': {
    hours: ['救生员白天值勤；县政府列出停车场全天开放。水上活动请按当日告示。', 'Lifeguards are listed for daylight hours and the county lists the lot as open 24 hours. Follow same-day notices for water access.'],
    admission: ['沙滩、游乐区及公共野餐区免费使用；停车与船艇租借另计。', 'The beach, playground and public picnic area are free to visit. Parking and boat rentals are separate.'],
    admissionSource: countyParking,
  },
  'burton-chace-park': {
    admission: ['步道及公共观景区免费。活动、团体设施预约和访客泊位按县政府规定办理。', 'Paths and public viewpoints are free. County rules cover events, group facilities and guest docks separately.'],
  },
  'fishermans-village': {
    hours: ['滨水步行应留意现场通行时间，店铺、餐厅及游船分别营业。', 'Check posted waterfront access. Shops, restaurants and cruises operate on separate schedules.'],
    admission: ['滨水公共通道可免费散步；餐饮、游船与停车分别付费。', 'Walking the public waterfront is free. Dining, cruises and parking are separate.'],
  },
  'aubrey-austin-park': {
    hours: ['白天查看公园入口告示。观景步道与北防波堤可能分别调整开放。', 'Check park notices on a daylight visit. The paths and north jetty may have separate access changes.'],
    admission: ['开放的公共步道及观景区免费。', 'Open public paths and viewpoints are free.'],
  },
  'yvonne-burke-park': {
    hours: ['建议白天使用港湾绿道，公共设施以现场开放公告为准。', 'Plan to use the marina greenway in daylight and follow signs for public facilities.'],
    admission: ['公共绿带与开放式运动区免费；按停车位置核对收费。', 'The public green and outdoor exercise area are free. Check signs for any parking fee.'],
  },
  'marina-wetland-park': {
    hours: ['建议白天沿开放步道参观，入口可能因养护调整。', 'Use the open path in daylight and check for maintenance closures at the entrance.'],
    admission: ['公共步道与解说区免费参观。', 'There is no admission charge for the public path and interpretation area.'],
  },
  'ballona-wetlands': {
    admission: ['先查看开放区域；预约导览的报名与费用由各主办方公布。', 'Check which areas are open. Tours use the registration and pricing rules of their organizers.'],
  },
  'del-rey-lagoon': {
    hours: ['建议白天走公园侧的开放岸线，临时设施调整以现场告示为准。', 'Visit the park-side shoreline in daylight and follow posted facility notices.'],
    admission: ['公共公园及开放岸线免费。', 'The public park and open shoreline are free to visit.'],
  },
  'dockweiler-beach': {
    hours: ['救生员白天值勤；停车场、青年中心与露营区查各自开放时间。', 'Lifeguards are listed for daylight hours. Parking, the youth center and camping have separate schedules.'],
    admission: ['公共沙滩免费；停车和房车露营另收费。', 'The public beach is free to visit. Parking and RV camping cost extra.'],
    admissionSource: countyParking,
  },
  'santa-monica-pier': {
    hours: ['公共码头每天 06:00–22:00 开放，场馆、餐厅和维护通道有单独安排。', 'The public pier is open daily, 6 a.m.–10 p.m. Venues, restaurants and maintenance detours have separate arrangements.'],
    admission: ['公共码头免费，游乐项目、餐饮和停车另计。', 'The public pier is free. Rides, dining and parking cost extra.'],
    hoursSource: pierFaq,
    admissionSource: pierFaq,
  },
  'pacific-park': {
    hours: ['游乐设施和游戏一般每天营业，开闭时间按运营日历及项目状态调整。', 'Rides and games normally open daily. Check the operating calendar and individual ride status.'],
    admission: ['可从公共甲板观赏。乘坐项目有单项票与套票，具体价格以官方票务为准。', 'View the rides from the public deck. Individual ride tickets and passes are priced on the official ticket site.'],
    hoursSource: 'https://pacpark.com/hours/',
    admissionSource: 'https://pacpark.com/tickets/',
  },
  'heal-the-bay-aquarium': {
    admission: ['在常规开放暂停期间，课程、导览和预约项目以活动页面标示的费用为准。', 'While regular public hours are paused, use the listed price for each program, tour or booking.'],
  },
  'looff-hippodrome': {
    hours: ['从开放的码头可看外观；馆内与旋转木马按当日运营安排开放。', 'See the exterior whenever the pier deck is accessible. Check the operator for indoor and carousel hours.'],
    admission: ['从公共甲板看馆舍免费，旋转木马按现场票务收费。', 'The pavilion exterior is free to view from the public deck. Carousel rides are separately ticketed.'],
    admissionSource: 'https://pacpark.com/visit/santa-monica-pier-directory/',
  },
  'original-muscle-beach': {
    hours: ['海滨露天设施，宜在白天观看或使用，以现场标示为准。', 'Plan a daylight visit to the outdoor beach facilities and follow posted access signs.'],
    admission: ['公共海滨锻炼区免费。', 'The public beachfront exercise area is free.'],
  },
  'tongva-park': { ...cityParkHours, admission: ['公共步道和观景台免费。', 'Public paths and lookouts are free.'] },
  'palisades-park': {
    hours: ['按市立公园规则，05:00 至午夜开放；临时封闭及活动以入口告示为准。', 'Park rules list access from 5 a.m. to midnight. Follow posted changes and closures.'],
    hoursSource: cityParkCode,
    admission: ['崖顶公共步道免费；周边停车另计。', 'The public bluff-top path is free. Nearby parking is separate.'],
  },
  'crescent-bay-park': { ...cityParkHours, admission: ['公共草坪和正常开放的凉亭免费，专场预约另有规则。', 'The lawns and gazebo are free during public access. Private reservations follow separate rules.'] },
  'ocean-view-park': { ...cityParkHours, admission: ['公共绿地免费。网球场收费及预约请查市政府的球场规则。', 'The public lawn is free. Check city rules for tennis fees and reservations.'] },
  'ozone-park': { ...cityParkHours, admission: ['公共社区绿地免费，无需门票。', 'The public neighborhood green is free and requires no ticket.'] },
  'annenberg-beach-house': {
    hours: ['公共场地、泳池与客舍导览的时间不同，分别查看市政府的到访安排。', 'Public grounds, pool sessions and guest house tours have separate schedules. Check the city’s visitor information.'],
    admission: ['公共场地免费。泳池、停车及特别活动另查收费；客舍按导览日历安排。', 'Public grounds are free. Check separate fees for the pool, parking and special events. See the tour calendar for the guest house.'],
    hoursSource: 'https://www.santamonica.gov/places/cultural-venue/annenberg-community-beach-house',
    admissionSource: 'https://www.santamonica.gov/places/cultural-venue/annenberg-community-beach-house',
  },
  'edgington-park': {
    hours: ['建议白天停留，纪念绿地的临时通行安排以现场为准。', 'Plan a daylight stop and follow any posted access changes at the memorial.'],
    admission: ['公共纪念绿地免费参观。', 'The public memorial green is free to visit.'],
  },
};
