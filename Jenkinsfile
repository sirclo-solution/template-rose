import org.jenkinsci.plugins.pipeline.modeldefinition.Utils
@Library("jsl") _

nexusTemplateDeployment(
    unitName:"rose",
    clusterNameStaging:"kubernetes-sirclo-staging",
    clusterNameProd:"kubernetes-sirclo-prod",
    unitTestFileName:"nexusTemplateUnitTest.sh",
    projectNameStaging:"sirclo-nonprod",
    projectNameProd:"sirclo-prod",
    deployerStagingFileName:"nexusTemplateDeployerStaging.sh",
    deployerCanaryFileName:"nexusTemplateDeployerCanary.sh",
    deployerProdFileName:"nexusTemplateDeployerProd.sh"
)