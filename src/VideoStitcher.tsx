
import { Series, Video, staticFile } from 'remotion';

const videos = [
  {
    "name": "001.mp4",
    "durationInFrames": 1767
  },
  {
    "name": "002.mp4",
    "durationInFrames": 3754
  },
  {
    "name": "003.mov",
    "durationInFrames": 240
  },
  {
    "name": "004.mov",
    "durationInFrames": 401
  },
  {
    "name": "005.mov",
    "durationInFrames": 763
  },
  {
    "name": "006.mov",
    "durationInFrames": 673
  },
  {
    "name": "007.mov",
    "durationInFrames": 1606
  },
  {
    "name": "008.mov",
    "durationInFrames": 99
  },
  {
    "name": "009.mov",
    "durationInFrames": 724
  },
  {
    "name": "010.mov",
    "durationInFrames": 764
  },
  {
    "name": "011.mov",
    "durationInFrames": 713
  },
  {
    "name": "012.mov",
    "durationInFrames": 41
  },
  {
    "name": "013.mov",
    "durationInFrames": 2051
  },
  {
    "name": "014.mov",
    "durationInFrames": 213
  },
  {
    "name": "015.mov",
    "durationInFrames": 410
  },
  {
    "name": "016.mov",
    "durationInFrames": 108
  },
  {
    "name": "017.mov",
    "durationInFrames": 459
  },
  {
    "name": "018.mov",
    "durationInFrames": 786
  },
  {
    "name": "019.mov",
    "durationInFrames": 6168
  },
  {
    "name": "020.mov",
    "durationInFrames": 320
  },
  {
    "name": "021.mov",
    "durationInFrames": 928
  },
  {
    "name": "022.mov",
    "durationInFrames": 865
  },
  {
    "name": "023.mov",
    "durationInFrames": 230
  },
  {
    "name": "024.mov",
    "durationInFrames": 2011
  },
  {
    "name": "025.mov",
    "durationInFrames": 2639
  },
  {
    "name": "026.mov",
    "durationInFrames": 298
  },
  {
    "name": "027.mov",
    "durationInFrames": 456
  },
  {
    "name": "028.mov",
    "durationInFrames": 401
  },
  {
    "name": "029.mov",
    "durationInFrames": 693
  },
  {
    "name": "030.mov",
    "durationInFrames": 270
  },
  {
    "name": "031.mov",
    "durationInFrames": 225
  },
  {
    "name": "032.mov",
    "durationInFrames": 977
  },
  {
    "name": "033.mov",
    "durationInFrames": 5260
  },
  {
    "name": "034.mov",
    "durationInFrames": 546
  },
  {
    "name": "035.mov",
    "durationInFrames": 3221
  },
  {
    "name": "036.mov",
    "durationInFrames": 1117
  },
  {
    "name": "037.mov",
    "durationInFrames": 248
  },
  {
    "name": "038.mov",
    "durationInFrames": 1018
  },
  {
    "name": "039.mov",
    "durationInFrames": 530
  },
  {
    "name": "040.mov",
    "durationInFrames": 327
  },
  {
    "name": "041.mp4",
    "durationInFrames": 495
  },
  {
    "name": "042.mov",
    "durationInFrames": 293
  },
  {
    "name": "043.mov",
    "durationInFrames": 197
  },
  {
    "name": "044.mov",
    "durationInFrames": 249
  },
  {
    "name": "045.mov",
    "durationInFrames": 306
  },
  {
    "name": "046.mov",
    "durationInFrames": 133
  },
  {
    "name": "047.mov",
    "durationInFrames": 347
  },
  {
    "name": "048.mov",
    "durationInFrames": 92
  },
  {
    "name": "049.mov",
    "durationInFrames": 435
  },
  {
    "name": "050.mov",
    "durationInFrames": 143
  },
  {
    "name": "051.mov",
    "durationInFrames": 536
  },
  {
    "name": "052.mov",
    "durationInFrames": 988
  },
  {
    "name": "053.mov",
    "durationInFrames": 297
  },
  {
    "name": "054.mov",
    "durationInFrames": 420
  },
  {
    "name": "055.mov",
    "durationInFrames": 270
  },
  {
    "name": "056.mov",
    "durationInFrames": 392
  },
  {
    "name": "057.mov",
    "durationInFrames": 433
  },
  {
    "name": "058.mov",
    "durationInFrames": 276
  },
  {
    "name": "059.mov",
    "durationInFrames": 1089
  },
  {
    "name": "060.mov",
    "durationInFrames": 7580
  },
  {
    "name": "061.mov",
    "durationInFrames": 321
  },
  {
    "name": "062.mov",
    "durationInFrames": 750
  },
  {
    "name": "063.mov",
    "durationInFrames": 712
  },
  {
    "name": "064.mov",
    "durationInFrames": 545
  },
  {
    "name": "065.mov",
    "durationInFrames": 1658
  },
  {
    "name": "066.mov",
    "durationInFrames": 828
  },
  {
    "name": "067.mov",
    "durationInFrames": 1905
  },
  {
    "name": "068.mov",
    "durationInFrames": 1353
  },
  {
    "name": "069.mov",
    "durationInFrames": 930
  },
  {
    "name": "070.mov",
    "durationInFrames": 511
  },
  {
    "name": "071.mov",
    "durationInFrames": 1460
  },
  {
    "name": "072.mov",
    "durationInFrames": 702
  },
  {
    "name": "073.mov",
    "durationInFrames": 395
  },
  {
    "name": "074.mov",
    "durationInFrames": 794
  },
  {
    "name": "075.mov",
    "durationInFrames": 238
  },
  {
    "name": "076.mov",
    "durationInFrames": 651
  },
  {
    "name": "077.mov",
    "durationInFrames": 614
  },
  {
    "name": "078.mov",
    "durationInFrames": 1782
  }
];

export const VideoStitcher: React.FC = () => {
  return (
    <Series>
      {videos.map((v, i) => (
        <Series.Sequence key={i} durationInFrames={v.durationInFrames}>
          <Video src={staticFile(`imported_videos/${v.name}`)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
