<template>
  <div class="h-100 mg-100 pt-4 container px-0 px-md-5 bg-info shadow">
    <div class="overflow-auto h-100 w-100 d-flex flex-column align-items-center">
      <h1 class="pb-4 text-center">Come meet us at some local events near you!</h1>
      <div v-for="(event, index) in events" :key="`event-${index}`" class="row w-75 border border-dark border-bottom-0 py-3 text-center text-md-left">
        <h2 class="col-12 col-md-6 font-weight-bold">{{ event.date }}</h2>
        <h2 class="col-12 col-md-6 text-md-right">{{ event.location }}</h2>
      </div>
    </div>
  </div>
</template>

<script>

export default({

    name: "EventsPage",
    layout: "main",
    data() {
      return {
          'events': [
            {
              date: 'September 17th',
              location: 'Riverhead Cider House'
            },
            {
              date: 'September 24th',
              location: 'Riverhead Cider House'
            },
            {
              date: 'September 24th',
              location: 'Jamesport Brewery'
            },
            {
              date: 'October 1st',
              location: 'Riverhead Cider House'
            },
            {
              date: 'October 7th-9th',
              location: 'Huntington Fall Festival in Heckscher Park'
            },
            {
              date: 'October 15th',
              location: 'Riverhead Cider House'
            },
            {
              date: 'November 5th',
              location: 'Riverhead Cider House'
            },
          ]
      }
    }
})

</script>