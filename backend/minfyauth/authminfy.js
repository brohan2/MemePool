const authminfy = async (req, res, next) => {
  try {
    const minfyEmails = [
"abhinav.bisht@minfytech.com",
"akankssha.adepu@minfytech.com",
"akash.kumar@minfytech.com",
"akhilesh.gone@minfytech.com",
"amaan.ahmed@minfytech.com",
"aravind.appusamy@minfytech.com",
"aravind.mandan@minfytech.com",
"aryan.mohapatra@minfytech.com",
"ashritha.kanike@minfytech.com",
"avanish.kumar@minfytech.com",
"avishkar.mane@minfytech.com",
"boddupally.rohan@minfytech.com",
"venkata.kowshik@minfytech.com",
"charishma.gajula@minfytech.com",
"donthula.supriya@minfytech.com",
"durgeshwar.upputuri@minfytech.com",
"himaghna.das@minfytech.com",
"hruthik.mekala@minfytech.com",
"javvadi.tanmaie@minfytech.com",
"siva.nithin@minfytech.com",
"kavya.sharma@minfytech.com",
"keerthi.kelam@minfytech.com",
"krishna.agarwal@minfytech.com",
"livanshu.saini@minfytech.com",
"madhukumar.chilukuri@minfytech.com",
"mahak.yadav@minfytech.com",
"mayur.pal@minfytech.com",
"midhilesh.polisetty@minfytech.com",
"venkatamanikanta.sai@minfytech.com",
"nihaar.reddy@minfytech.com",
"om.raj@minfytech.com",
"priysh.rai@minfytech.com",
"rakesh.ravi@minfytech.com",
"sanskar.goyal@minfytech.com",
"shivam.pandey@minfytech.com",
"subramanya.rithwik@minfytech.com",
"syed.sofiyan@minfytech.com",
"vaibhav.singh@minfytech.com",
"valluru.yashwanthreddy@minfytech.com",
"venkatsai.kancherla@minfytech.com",
"vinaykumar.mattapally@minfytech.com",
"yash.rajput@minfytech.com",
"voma.sreeja@minfytech.com",
"shybash.shaik@minfytech.com",
"uzaif.ali@minfytech.com",
"venkatsai.anilkumar@minfytech.com",
"abhishek.narmula@minfytech.com",
"samrath.reddy@minfytech.com",
"uday.kiran@minfytech.com",
"venkata.lithin@minfytech.com",
"giripriya.katam@minfytech.com",
"saikiran.polaki@minfytech.com",
"example850@gmail.com",
"example129@gmail.com"
];


    const { email } = req.body;

    const isVerified = minfyEmails.some(
      (e) => e.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (isVerified) {
      console.log("Verified");
      return next(); // Allow request to proceed
    }

    return res.status(400).json({ success: false, error: "User not verified" });

  } catch (e) {
    console.error("authminfy error:", e);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export default authminfy;
