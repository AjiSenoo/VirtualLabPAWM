import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface DataPoint {
  time: number;
  displacement: number;
}

const SimpleHarmonicMotionLab = () => {
  const [amplitude, setAmplitude] = useState<number>(1);
  const [springConstant, setSpringConstant] = useState<number>(10);
  const [timePeriod, setTimePeriod] = useState<number>(0);
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  const calculateSHM = () => {
    try {
      const mass = 1;
      const k = springConstant;
      const omega = Math.sqrt(k / mass);
      const period = 2 * Math.PI / omega;
      
      setTimePeriod(period);

      const newData: DataPoint[] = [];
      const steps = 50;
      const dt = period / steps;

      for (let i = 0; i <= steps; i++) {
        const t = i * dt;
        const displacement = amplitude * Math.cos(omega * t);
        newData.push({
          time: Number(t.toFixed(2)),
          displacement: Number(displacement.toFixed(3))
        });
      }

      setChartData(newData);
    } catch (error) {
      console.error('Error calculating SHM:', error);
    }
  };

  // Update simulation whenever amplitude or spring constant changes
  useEffect(() => {
    calculateSHM();
  }, [amplitude, springConstant]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <LinearGradient
          colors={['#1a237e', '#0d47a1']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Simple Harmonic Motion</Text>
          <Text style={styles.headerSubtitle}>Interactive Spring Simulation</Text>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={styles.controlsContainer}>
            <Text style={styles.label}>Amplitude: {amplitude.toFixed(1)} m</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={5.0}
              step={0.1}
              value={amplitude}
              onValueChange={setAmplitude}
              minimumTrackTintColor="#1a237e"
              maximumTrackTintColor="#E3F2FD"
              thumbTintColor="#1a237e"
            />

            <Text style={styles.label}>Spring Constant: {springConstant.toFixed(0)} N/m</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={100}
              step={1}
              value={springConstant}
              onValueChange={setSpringConstant}
              minimumTrackTintColor="#1a237e"
              maximumTrackTintColor="#E3F2FD"
              thumbTintColor="#1a237e"
            />

            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Time Period</Text>
              <Text style={styles.resultValue}>{timePeriod.toFixed(2)} s</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: chartData.map(point => point.time.toString()),
                datasets: [{
                  data: chartData.map(point => point.displacement)
                }]
              }}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(26, 35, 126, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#1a237e'
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#E3F2FD'
                }
              }}
              bezier
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=" m"
              segments={5}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  mainContent: {
    padding: 20,
    paddingBottom: 40,
  },
  controlsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: '#1a237e',
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resultCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#1a237e',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
});

export default SimpleHarmonicMotionLab;