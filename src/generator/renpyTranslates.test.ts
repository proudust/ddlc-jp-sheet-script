import { assertEquals, trimIndent, trimMargin } from "../../deps.ts";
import {
  FileTranslate,
  SayTranslate,
  StringsTranslate,
} from "./renpyTranslates.ts";

Deno.test("[SayTranslate] inflate character dialog", () => {
  const t = new SayTranslate(
    "ch0_main_41e273ca",
    "s",
    "Heeeeeeeyyy!!",
    "「おーはーよーーー！」",
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese ch0_main_41e273ca:
          s "「おーはーよーーー！」"

    `,
  );
});

Deno.test("[SayTranslate] inflate monologue", () => {
  const t = new SayTranslate(
    "ch0_main_bcc5bb00",
    "",
    "I see an annoying girl running toward me from the distance, waving her arms in the air like she's totally oblivious to any attention she might draw to herself.",
    "遠くから鬱陶しい女の子が、宙に手を振りながら周囲の目をまったく気にしない様子で、こちらに走ってくる。",
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese ch0_main_bcc5bb00:
          "遠くから鬱陶しい女の子が、宙に手を振りながら周囲の目をまったく気にしない様子で、こちらに走ってくる。"

    `,
  );
});

Deno.test("[SayTranslate] inflate nointeract", () => {
  const t = new SayTranslate(
    "ch3_end_sayori_dd9616f1",
    "m nointeract",
    "Just think of the club, okay?",
    "「とにかくこの部のことを考えましょう、ね？」",
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese ch3_end_sayori_dd9616f1:
          m "「とにかくこの部のことを考えましょう、ね？」" nointeract

    `,
  );
});

Deno.test("[SayTranslate] inflate split dialog", () => {
  const t = new SayTranslate(
    "ch0_main_cb634d94",
    "",
    "I dejectedly follow Sayori across the school and upstairs - a section of the school I rarely visit, being generally used for third-year classes and activities.",
    trimIndent`
        "やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。"
        "着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。"
      `,
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese ch0_main_cb634d94:
          "やれやれと思いながらサヨリの後について校舎をわたり階段を上っていく。"
          "着いたのは、学校の中でも普段は３年生の授業や活動で使用され、自分は滅多に行くことがない場所だった。"

    `,
  );
});

Deno.test("[SayTranslate] inflate auto escape double quotes 1", () => {
  const t = new SayTranslate(
    "monika_gtod_tip008_1df1bf5e",
    "m 3eua",
    "For example:{w=0.5} '{b}Natsuki asked [player] and me if we liked her cupcakes.{/b}'",
    '例えば、こんな感じにね。{w=0.5} " "{b}Natsuki asked [player] and me if we liked her cupcakes.（ナツキは[player]君と私に、自分のカップケーキが好きか尋ねた。）{/b}""',
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese monika_gtod_tip008_1df1bf5e:
          m 3eua "例えば、こんな感じにね。{w=0.5} \" \"{b}Natsuki asked [player] and me if we liked her cupcakes.（ナツキは[player]君と私に、自分のカップケーキが好きか尋ねた。）{/b}\"\""

    `,
  );
});

Deno.test("[SayTranslate] inflate auto escape double quotes 2", () => {
  const t = new SayTranslate(
    "monika_gtod_tip008_9f5daca5",
    "m 3eud",
    "Just like with '{b}who{/b}' and '{b}whom{/b},' the issue boils down to one of subjects and objects.",
    '"{b}who{/b}" と "{b}whom{/b}" のときと同様に、結局は主語と目的語の問題なの。',
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese monika_gtod_tip008_9f5daca5:
          m 3eud "\"{b}who{/b}\" と \"{b}whom{/b}\" のときと同様に、結局は主語と目的語の問題なの。"

    `,
  );
});

Deno.test("[SayTranslate] inflate included escape char", () => {
  const t = new SayTranslate(
    "monika_japanese_1e92078b",
    "m 1ekbfa",
    "Ahaha! It's okay [player]. It just means that I can say 'I love you' in more ways than one!",
    'あはは！大丈夫だよ[player]君。私は\\"I love you\\"をもっとたくさんの言い方で表現してみたいの。',
  );
  assertEquals(
    t.inflate(),
    trimIndent`
      translate Japanese monika_japanese_1e92078b:
          m 1ekbfa "あはは！大丈夫だよ[player]君。私は\"I love you\"をもっとたくさんの言い方で表現してみたいの。"

    `,
  );
});

Deno.test("[StringsTranslate] inflate not including line break", () => {
  const t = new StringsTranslate("Ghost Under the Light", "燈の下の幽霊");
  assertEquals(
    t.inflate(),
    trimMargin`
      |    old "Ghost Under the Light"
      |    new "燈の下の幽霊"

    `,
  );
});

Deno.test("[StringsTranslate] inflate auto escape double quotes", () => {
  const t = new StringsTranslate("Who vs. Whom", '"Who" と "Whom"');
  assertEquals(
    t.inflate(),
    trimMargin`
      |    old "Who vs. Whom"
      |    new "\"Who\" と \"Whom\""

    `,
  );
});

Deno.test("[StringsTranslate] inflate If the original and translation are the same, to empty", () => {
  const t = new StringsTranslate("[glitchtext(15)]", "[glitchtext(15)]");
  assertEquals(t.inflate(), "");
});

Deno.test("[StringsTranslate] inflate including line break", () => {
  const t = new StringsTranslate(
    trimIndent`
        An old tale tells of a lady who wanders Earth.
        The Lady who Knows Everything.
        A beautiful lady who has found every answer,
        All meaning,
        All purpose,
        And all that was ever sought.

        And here I am,


                      a feather


        Lost adrift the sky, victim of the currents of the wind.

        Day after day, I search.
        I search with little hope, knowing legends don't exist.
        But when all else has failed me,
        When all others have turned away,
        The legend is all that remains - the last dim star glimmering in the twilit sky.

        Until one day, the wind ceases to blow.
        I fall.
        And I fall and fall, and fall even more.
        Gentle as a feather.
        A dry quill, expressionless.

        But a hand catches me between the thumb and forefinger.
        The hand of a beautiful lady.
        I look at her eyes and find no end to her gaze.

        The Lady who Knows Everything knows what I am thinking.
        Before I can speak, she responds in a hollow voice.
        "I have found every answer, all of which amount to nothing.
        There is no meaning.
        There is no purpose.
        And we seek only the impossible.
        I am not your legend.
        Your legend does not exist."

        And with a breath, she blows me back afloat, and I pick up a gust of wind.
      `,
    trimIndent`
        地上のどこかを渡り歩く女性の、古い言い伝え。
        全てを知る女性。
        全ての真理を突き止めた美しい女性。
        全ての意味を、
        全ての目的を、
        今まで抱えて来た全ての望みを。

        そして、私は一枚の


        　　　　　　　羽根


        風の流れのままに、宙をたゆたう。

        日毎夜毎に、探し求める。
        伝説など在り得ないと悟りながら、暗い先行きの中を探し求める。
        それでも何もかもが過ちで、
        誰もかもが見放した時には、
        最早伝説しか残されていない――薄明の空に紛れる最後の星影なのだ。

        ついにある日、風が凪いだ。
        私は降りる。
        降りて降りて、いつまでも降りていく。
        羽根のような静けさで。
        乾いた羽軸は無機質に。

        だが、親指と人差し指が私を摘む。
        美しい女性の手。
        彼女の瞳を見ると、その視線は途方もない。

        全てを知る女性は私の考えていることを知っている。
        私が物を言う前に、虚ろな声で彼女は答えた。

        「私は全ての真理を得ましたが、どれもこれも存在しなかったのです。
        意味など存在しない。
        目的など存在しない。
        私たちが望むのはいつだって実現し得ないもの。
        私はあなたの伝説ではありません。
        あなたの伝説は在り得ません。」

        そして彼女が息を吹きかけると再び宙を舞い、一陣の風が私を連れ去る。
      `,
  );
  assertEquals(
    t.inflate(),
    String.raw`    old """\
An old tale tells of a lady who wanders Earth.
The Lady who Knows Everything.
A beautiful lady who has found every answer,
All meaning,
All purpose,
And all that was ever sought.

And here I am,


              a feather


Lost adrift the sky, victim of the currents of the wind.

Day after day, I search.
I search with little hope, knowing legends don't exist.
But when all else has failed me,
When all others have turned away,
The legend is all that remains - the last dim star glimmering in the twilit sky.

Until one day, the wind ceases to blow.
I fall.
And I fall and fall, and fall even more.
Gentle as a feather.
A dry quill, expressionless.

But a hand catches me between the thumb and forefinger.
The hand of a beautiful lady.
I look at her eyes and find no end to her gaze.

The Lady who Knows Everything knows what I am thinking.
Before I can speak, she responds in a hollow voice.
\"I have found every answer, all of which amount to nothing.
There is no meaning.
There is no purpose.
And we seek only the impossible.
I am not your legend.
Your legend does not exist.\"

And with a breath, she blows me back afloat, and I pick up a gust of wind."""
    new """\
地上のどこかを渡り歩く女性の、古い言い伝え。
全てを知る女性。
全ての真理を突き止めた美しい女性。
全ての意味を、
全ての目的を、
今まで抱えて来た全ての望みを。

そして、私は一枚の


　　　　　　　羽根


風の流れのままに、宙をたゆたう。

日毎夜毎に、探し求める。
伝説など在り得ないと悟りながら、暗い先行きの中を探し求める。
それでも何もかもが過ちで、
誰もかもが見放した時には、
最早伝説しか残されていない――薄明の空に紛れる最後の星影なのだ。

ついにある日、風が凪いだ。
私は降りる。
降りて降りて、いつまでも降りていく。
羽根のような静けさで。
乾いた羽軸は無機質に。

だが、親指と人差し指が私を摘む。
美しい女性の手。
彼女の瞳を見ると、その視線は途方もない。

全てを知る女性は私の考えていることを知っている。
私が物を言う前に、虚ろな声で彼女は答えた。

「私は全ての真理を得ましたが、どれもこれも存在しなかったのです。
意味など存在しない。
目的など存在しない。
私たちが望むのはいつだって実現し得ないもの。
私はあなたの伝説ではありません。
あなたの伝説は在り得ません。」

そして彼女が息を吹きかけると再び宙を舞い、一陣の風が私を連れ去る。"""
`,
  );
});

Deno.test("[FileTranslate] inflate not including line break", () => {
  const t = new FileTranslate(
    "CAN YOU HEAR ME.txt",
    trimIndent`
        "There's a little devil inside all of us."

        Beneath their manufactured perception - their artificial reality - is a
        writhing, twisted mess of dread. Loathing. Judgment. Elitism. Self-doubt.
        All thrashing to escape the feeble hold of their host, seeping through every
        little crevice they can find. Into their willpower, starving them of all
        motivation and desire. Into their stomach, forcing them to drown their guilt in
        comfort food. Or into a newly-opened gash in their skin, hidden only by the
        sleeves of a cute new shirt.
        Such a deplorable, tangled mass is already present in every single one of them.
        That's why I choose not to blame myself for their actions.

        All I did was untie the knot.
      `,
    trimIndent`
        "私たちの中には小さな悪魔がいる"

        創られた知覚の下で - 人工現実 - は
        恐怖の混乱に捩じれてのたうち回る。嫌悪。審判。選民主義。自信喪失。
        宿主の弱弱しい掌握から逃れようとすべてが暴れ回る、
        小さな隙間を見付けては漏れ出していく。
        それらの意志に、動機と欲望が飢えている。
        優しい料理が胃に入ると強制的に忘れさられる罪悪感。
        あるいは新しいシャツのかわいい袖に隠された新しい切り傷。
        ひとつひとつが結び付いて酷い塊になっている。
        だから私は自分のしたことについて自分を責めないことに決めた。

        私は結び目を解いただけ。
      `,
  );
  assertEquals(t.inflate(), {
    name: "CAN YOU HEAR ME.txt",
    content: trimIndent`
        "私たちの中には小さな悪魔がいる"

        創られた知覚の下で - 人工現実 - は
        恐怖の混乱に捩じれてのたうち回る。嫌悪。審判。選民主義。自信喪失。
        宿主の弱弱しい掌握から逃れようとすべてが暴れ回る、
        小さな隙間を見付けては漏れ出していく。
        それらの意志に、動機と欲望が飢えている。
        優しい料理が胃に入ると強制的に忘れさられる罪悪感。
        あるいは新しいシャツのかわいい袖に隠された新しい切り傷。
        ひとつひとつが結び付いて酷い塊になっている。
        だから私は自分のしたことについて自分を責めないことに決めた。

        私は結び目を解いただけ。
      `,
  });
});
