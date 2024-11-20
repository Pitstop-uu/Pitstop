const jsonResponse = (success: boolean, status: number, data: any) => {
	return new Response(
		JSON.stringify({ success, status, data }),
		{ headers: { 'Content-Type': 'application/json' }, status }
	)
}

export default jsonResponse;