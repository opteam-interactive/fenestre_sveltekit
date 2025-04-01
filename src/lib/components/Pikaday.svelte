<script lang="ts">
    import { getHolidays, getCalendarEndBound } from "$lib/utils/date";
    import { format } from "date-fns";

    let { value = $bindable(), name, ariaInvalid } = $props(); // Expect value as a prop
    const holidays = getHolidays(new Date().getFullYear());
    const endBound = getCalendarEndBound();

    let myDatepicker = $state<HTMLInputElement | null>(null);

    let labelValue = $state("");
    let localValue = $state("Veuillez choisir une date");

    $effect(() => {
        const setUpPikaday = async () => {
            if (!myDatepicker) return;

            const Pikaday = (await import("pikaday")).default;

            const picker = new Pikaday({
                field: myDatepicker,
                format: "YYYY-MM-DD",
                // minDate: new Date(),
                // maxDate: endBound,
                disableWeekends: true,

                onSelect: (date) => {
                    console.log("Raw Selected Date (Local):", date);
                    const utcMidnight = new Date(
                        Date.UTC(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                        )
                    );
                    console.log("UTC Midnight:", utcMidnight.toISOString()); // Log ISO string
                    value = format(utcMidnight, "yyyy-MM-dd");
                    console.log("Stored Date (yyyy-MM-dd):", value);
                },
                firstDay: 1,
                disableDayFn: (date: Date) => {
                    return holidays.some(
                        (holiday) =>
                            holiday.toDateString() === date.toDateString()
                    );
                },
                i18n: {
                    previousMonth: "Mois précedent",
                    nextMonth: "Mois suivant",
                    months: [
                        "Janvier",
                        "Février",
                        "Mars",
                        "Avril",
                        "Mai",
                        "Juin",
                        "Juillet",
                        "Aout",
                        "Septembre",
                        "Octobre",
                        "Novembre",
                        "Decembre",
                    ],
                    weekdays: [
                        "Dimanche",
                        "Lundi",
                        "Mardi",
                        "Mercredi",
                        "Jeudi",
                        "Vendredi",
                        "Samedi",
                    ],
                    weekdaysShort: [
                        "Dim",
                        "Lun",
                        "Mar",
                        "Mer",
                        "Jeu",
                        "Ven",
                        "Sam",
                    ],
                },
            });

            // Cleanup function (runs when effect re-runs or component unmounts)
            return () => picker.destroy();
        };
        setUpPikaday();
    });
</script>

<input
    type="text"
    class="input pika-single w-full rounded-full"
    {name}
    bind:this={myDatepicker}
    value={localValue}
    aria-invalid={ariaInvalid}
/>

<!--     {...$constraints.plateNumber} -->
