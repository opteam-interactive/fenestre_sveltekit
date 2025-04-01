<script lang="ts">
	let { data, form } = $props();

</script>
{#if form?.error}
<p class="error">{form.error}</p>
{/if}
{#if form?.success}
<p class="success">{form.success}</p>
{/if}

<form method="post">
    <div class='mb-5'>
        <label
            for='name'
            class='mb-3 block text-base font-medium text-black'
        >
            Full Name
        </label>
        <input
            type='text'
            placeholder='Full Name'
            class='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            name = "name"
        />
    </div>
    <div class='mb-5'>
        <label
            for='email'
            class='mb-3 block text-base font-medium text-black'
        >
            Email Address
        </label>
        <input
            type='email'
            placeholder='example@domain.com'
            class='w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            name="email"
        />
    </div>
    <div class='mb-5'>
        <label
            for='message'
            class='mb-3 block text-base font-medium text-black'
        >
            Message
        </label>
        <textarea
            rows={4}
            placeholder='Type your message'
            class='w-full resize-none rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md'
            name="message"
        ></textarea>
    </div>
    <div>
        <button type='submit' class='hover:shadow-form rounded-md bg-purple-500 py-3 px-8 text-base font-semibold text-white outline-none'>
            Submit
        </button>
    </div>
</form>