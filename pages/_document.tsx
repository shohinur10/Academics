import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				<meta name="keyword" content={'academics, language learning, online courses, IELTS, Korean, English academy'} />
				<meta
					name={'description'}
					content={
						'Academics — Learn languages online and offline with expert instructors. Browse courses in English, Korean, IELTS, TOEIC and more. | ' +
						'Academics — Изучайте языки онлайн и офлайн с опытными преподавателями. Курсы английского, корейского, IELTS и другие. | ' +
						'Academics — 전문 강사와 함께 온·오프라인 언어를 배우세요. 영어, 한국어, IELTS, TOEIC 등 다양한 코스.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
