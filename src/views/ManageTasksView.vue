<script setup>
import { ref } from "vue";


const row1BarList = ref([
  {
    myBeginDate: "2021-07-13 13:00",
    myEndDate: "2021-07-13 19:00",
    ganttBarConfig: {
      // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "Lorem ipsum dolor",
    },
  },
]);
const row2BarList = ref([
  {
    myBeginDate: "2021-07-13 00:00",
    myEndDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "Hey, look at me",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black",
      },
      class: "foo", // you can also add CSS classes to your bars!
    },
  },
  {
    myBeginDate: "2021-07-13 12:00",
    myEndDate: "2021-07-14 16:00",
    ganttBarConfig: {
      id: "another-unique-id-3",
      hasHandles: true,
      label: "Hey, look at me",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black",
      },
      class: "foo", // you can also add CSS classes to your bars!
    },
  },
]);

const rowBarList = ref([
  {
    label: "row 1",
    barList: [
      {
        myBeginDate: "2021-07-13 13:00",
        myEndDate: "2021-07-13 19:00",
        label: "bar 1",
        ganttBarConfig: {
          id: "bar1",
          color: "white",
          backgroundColor: "#404040",
          opacity: 0.5,
          immobile: true,
          label: "bar 1",
        },
      },
      {
        myBeginDate: "2021-07-14 00:00",
        myEndDate: "2021-07-15 02:00",
        label: "bar 2",
        ganttBarConfig: {
          id: "bar2",
          color: "white",
          backgroundColor: "#2e74a3",
          bundle: "blueBundle",
          label: "bar 2",
        },
      },
    ],
  },
  {
    label: "row 2",
    barList: [
      {
        myBeginDate: "2021-07-13 12:00",
        myEndDate: "2021-07-14 16:00",
        label: "bar 3",
        ganttBarConfig: {
          id: "Bar4",
          color: "white",
          backgroundColor: "#2e74a3",
          label: "bar 3",
        },
      },
    ],
  },
]);
</script>

<template>
  <!-- <g-gantt-chart
    chart-start="2021-07-12 12:00"
    chart-end="2021-07-18 12:00"
    precision="day"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <g-gantt-row label="My row 1" :bars="row1BarList" />
    <g-gantt-row label="My row 2" :bars="row2BarList" />
  </g-gantt-chart> -->

  <g-gantt-chart
    chart-start="2021-07-12 12:00"
    chart-end="2021-07-18 12:00"
    precision="day"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <g-gantt-row
      v-for="bar in rowBarList"
      :key="bar.label"
      :label="bar.label"
      :bars="bar.barList"
      type="row"
    />
  </g-gantt-chart>
</template>
