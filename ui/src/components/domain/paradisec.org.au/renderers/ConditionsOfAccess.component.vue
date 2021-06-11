<template>
    <div class="flex flex-col space-y-2">
        <div class="text-xl font-bold">Conditions of Access</div>

        <div>
            The following are general conditions for obtaining material from the Pacific And
            Regional Archive for Digital Sources in Endangered Cultures (hereinafter called
            PARADISEC). They assume that the depositor's permission has been obtained for copying.
            Specific restrictions accompany each item in PARADISEC.
        </div>
        <div>
            In consideration of PARADISEC agreeing to supply me with certain data in
            machine-readable form together with supporting documentation, I hereby undertake:
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Purpose:</div>
            <div class="w-4/5">
                To use the data for purposes of private scholarly research and/or for purposes of
                educational use, and not for profit (this shall not preclude the publication in a
                scholarly context of analyses or interpretations derived from the data, unless such
                publication is precluded by the conditions of deposit of the data in the PARADISEC).
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Acknowledgement:</div>
            <div class="w-4/5">
                To acknowledge in any work, published or unpublished, based in whole or in part on
                analyses of the data, both the original depositors of the data and PARADISEC (by use
                of the PARADISEC persistent identifier and citation form).
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Copyright:</div>
            <div class="w-4/5">
                Not to copy the data in whole or in part except insofar as this may be necessary for
                security purposes or for my own personal use. Not to distribute the data to third
                parties, nor to publish or reproduce it in any way. Copyright of all
                machine-readable data issued by PARADISEC is reserved.
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Access:</div>
            <div class="w-4/5">
                To give access to the data only to persons directly associated with me or working
                under my control and to require of such persons signed undertakings neither to use
                the data except in connection with my academic or educational purposes, nor to give
                access to the datas to others; these signed undertakings to be made available to
                PARADISEC on request. Not to give access to any third party if the conditions of
                deposit preclude this.
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Errors:</div>
            <div class="w-4/5">
                Not to hold PARADISEC liable for any errors of transcription or marking-up which may
                be found in the data, but to notify PARADISEC of such errors wherever possible.
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Revisions:</div>
            <div class="w-4/5">
                Where substantial revisions or reformatting of the data is permitted by the
                conditions of deposit and carried out as a part of my research, to inform PARADISEC,
                and also the original depositor if this is a condition of deposit, of the nature of
                such revisions and to deposit any such revised version at PARADISEC subject to the
                conditions of deposit of the original.
            </div>
        </div>

        <div class="flex flex-row">
            <div class="w-1/5 text-lg font-bold">Charges:</div>
            <div class="w-4/5">
                To pay such charges as PARADISEC may require to cover the cost of supplying the data
                (not applicable unless an invoice accompanies the data).
            </div>
        </div>

        <div class="flex flex-col space-y-4">
            <el-checkbox v-model="checked" @change="disableAccept = !disableAccept"
                >By clicking here I agree that I will not contravene this licence.
            </el-checkbox>
            <div>
                <el-button type="primary" :disabled="disableAccept" size="small" @click="accept"
                    >I agree</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            checked: false,
            disableAccept: true,
        };
    },
    methods: {
        accept() {
            this.$emit("accept-conditions");
        },
    },
};
</script>
