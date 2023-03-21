import { ResponsiveStream } from '@nivo/stream'

// make sure parent container have a defined height
/**
 * 
 Data example : [
  {
    "Raoul": 163,
    "Josiane": 167,
    "Marcel": 82,
    "René": 183,
    "Paul": 18,
    "Jacques": 107
  },
  {
    "Raoul": 30,
    "Josiane": 51,
    "Marcel": 14,
    "René": 83,
    "Paul": 174,
    "Jacques": 159
  }...
]
*/
const StreamChart = ({ data = [
    {
        "genoux_droit": 150,
        "genoux_gauche": 152,
      "coude": 167,
      "dos": 82,
      "tête": 183,
    },
    {
        "genoux_droit": 40,
        "genoux_gauche": 152,
      "coude": 167,
      "dos": 82,
      "tête": 183,
    },
    {
        "genoux_droit": 50,
        "genoux_gauche": 152,
      "coude": 167,
      "dos": 82,
      "tête": 183,
    },
    {
        "genoux_droit": 80,
        "genoux_gauche": 152,
      "coude": 167,
      "dos": 82,
      "tête": 183,
    },
    {
        "genoux_droit": 60,
        "genoux_gauche": 152,
      "coude": 167,
      "dos": 82,
      "tête": 183,
    },
    {
        "genoux_droit": 80,
        "genoux_gauche": 20,
      "coude": 200,
      "dos": 82,
      "tête": 140,
    } ] }) => (
    <ResponsiveStream
        data={data}
        margin={{ top: 50, right: 0, bottom: 550, left: 0 }}
        keys={[
            'genoux_droit',
            'genoux_gauche',
            'coude',
            'dos',
            'tête' 
        ]}
       
        axisTop={null}
        axisRight={null}
     
     
        enableGridX={true}
        enableGridY={false}
        offsetType="none"
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.85}
        borderColor={{ theme: 'background' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#2c998f',
                size: 4,
                padding: 2,
                stagger: true
            },
            {
                id: 'squares',
                type: 'patternSquares',
                background: 'inherit',
                color: '#e4c912',
                size: 6,
                padding: 2,
                stagger: true
            }
        ]}
        fill={[
            {
                match: {
                    id: 'coude'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'dos'
                },
                id: 'squares'
            }
        ]}
        dotSize={8}
        dotColor={{ from: 'color' }}
        dotBorderWidth={2}
        dotBorderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.7
                ]
            ]
        }}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 0,
                itemBackground: 'black',
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000000'
                        }
                    }
                ]
            }
        ]}
    />
)

export default StreamChart