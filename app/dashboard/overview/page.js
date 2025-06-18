/* app/admin/overview/page.js */
"use client";

import SeoHead from "@/components/SeoHead";
import { Card, Statistic, Row, Col } from "antd";
import axios from "@/utils/api";
import { useEffect, useState } from "react";

export default function Overview() {
	const [stats, setStats] = useState(null);

	useEffect(() => {
		(async () => {
			const { data } = await axios.get("/user/metrics/overview"); // **backend addition below**
			setStats(data);
		})();
	}, []);

	return (
		<>
			<SeoHead title='Client Overview' />
			<h2>Overview</h2>
			{stats && (
				<Row gutter={16}>
					<Col span={6}>
						<Card>
							<Statistic title='Videos Today' value={stats.videosToday} />
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic title='Active Subs' value={stats.subscriptions} />
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
}
