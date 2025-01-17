import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text } from '@/components/Themed';
import { LineChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

interface ChartData {
  time: number;
  height: number;
  distance: number;
}

export default function ProjectileLab() {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [timeOfFlight, setTimeOfFlight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [range, setRange] = useState(0);
  const [trajectoryData, setTrajectoryData] = useState<ChartData[]>([]);

  const calculateProjectile = useCallback(() => {
    const g = 9.81;
    const radianAngle = (angle * Math.PI) / 180;
    
    const t = (2 * velocity * Math.sin(radianAngle)) / g;
    const hMax = Math.pow(velocity * Math.sin(radianAngle), 2) / (2 * g);
    const r = (Math.pow(velocity, 2) * Math.sin(2 * radianAngle)) / g;

    const data: ChartData[] = [];
    const timeStep = t / 50;
    
    for (let time = 0; time <= t; time += timeStep) {
      const x = velocity * Math.cos(radianAngle) * time;
      const y = velocity * Math.sin(radianAngle) * time - (0.5 * g * Math.pow(time, 2));
      if (y < 0) break;
      
      data.push({
        time: Number(time.toFixed(2)),
        height: Number(y.toFixed(2)),
        distance: Number(x.toFixed(2))
      });
    }

    setTimeOfFlight(Number(t.toFixed(2)));
    setMaxHeight(Number(hMax.toFixed(2)));
    setRange(Number(r.toFixed(2)));
    setTrajectoryData(data);
  }, [angle, velocity]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Projectile Motion Lab",
          headerStyle: { backgroundColor: '#4ECDC4' },
          headerTintColor: '#fff'
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>Launch Angle: {angle}°</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={90}
              step={1}
              value={angle}
              onValueChange={setAngle}
              minimumTrackTintColor="#4ECDC4"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#4ECDC4"
            />

            <Text style={styles.label}>Initial Velocity: {velocity} m/s</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={50}
              step={1}
              value={velocity}
              onValueChange={setVelocity}
              minimumTrackTintColor="#4ECDC4"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#4ECDC4"
            />

            <TouchableOpacity 
              style={styles.button}
              onPress={calculateProjectile}
            >
              <Text style={styles.buttonText}>Calculate Trajectory</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.resultTitle}>Results:</Text>
            <Text style={styles.resultText}>Time of Flight: {timeOfFlight} s</Text>
            <Text style={styles.resultText}>Maximum Height: {maxHeight} m</Text>
            <Text style={styles.resultText}>Range: {range} m</Text>
          </View>

          {trajectoryData.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.chartTitle}>Trajectory Graph</Text>
              <LineChart
                data={{
                  labels: trajectoryData.map(point => point.distance.toFixed(1)),
                  datasets: [{
                    data: trajectoryData.map(point => point.height)
                  }]
                }}
                width={width - 40}
                height={300}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                yAxisLabel="m"
                xAxisLabel="m"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  }
});